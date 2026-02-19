import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-next-toast';
import { Lock, Mail } from 'lucide-react';
import { dashService } from '@/api/services/dash.service'
import { useDashAuthStore } from '../store/dashAuthStore';
import { MotionDiv } from '@shared/ui/MotionComponents';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { Form } from '@shared/ui/Form';
import { Input, PasswordInput } from '@shared/ui/Input';
import { Logo } from '@shared/ui/Logo';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const login = useDashAuthStore(state => state.login);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await dashService.login(values);
            if (response.success) {
                login(response.data.token, response.data.admin);
                toast.success('Access granted. Welcome to the Vault.');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Authentication failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px]"
            >
                <Card
                >
                    <div className="p-8 sm:p-12 space-y-10">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Logo size="xlarge"  />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-foreground tracking-tight">Dash Vault</h1>
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">Secure Entry Required</p>
                            </div>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            className="space-y-6"
                        >
                            <Form.Item
                                name="email"
                                label={<Form.Label>Email Address</Form.Label>}
                                rules={[
                                    { required: true, message: 'Please enter your admin email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input
                                    prefix={<Mail className="w-4 h-4 text-muted-foreground mr-2" />}
                                    placeholder="admin@paysats.com"
                                    size="lg"
                                    variant="filled"
                                    disabled={isLoading}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={<Form.Label>Security Key</Form.Label>}
                                rules={[{ required: true, message: 'Please enter your password' }]}
                            >
                                <PasswordInput
                                    prefix={<Lock className="w-4 h-4 text-muted-foreground mr-2" />}
                                    placeholder="••••••••"
                                    size="lg"
                                    variant="filled"
                                    disabled={isLoading}
                                />
                            </Form.Item>

                            <div className="pt-2">
                                <Button
                                    htmlType="submit"
                                    size="lg"
                                    fullWidth
                                    loading={isLoading}
                                    variant="default"
                                    className="h-14 text-base font-bold tracking-wide"
                                >
                                    {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
                                </Button>
                            </div>
                        </Form>

                        <div className="pt-4 text-center">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                                Paysats internal management vZERO
                            </p>
                        </div>
                    </div>
                </Card>
            </MotionDiv>
        </div>
    );
};

export default LoginPage;
