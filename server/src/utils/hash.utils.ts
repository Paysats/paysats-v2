import crypto from 'crypto';

export class HashUtils {
  static hashIp(ip: string): string {
    return crypto
      .createHash('sha256')
      .update(ip + process.env.IP_HASH_SALT || 'default-salt')
      .digest('hex');
  }

  static hashIdentifier(identifier: string): string {
    return crypto
      .createHash('sha256')
      .update(identifier)
      .digest('hex');
  }
}

