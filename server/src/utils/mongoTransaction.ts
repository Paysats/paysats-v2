import mongoose, { ClientSession } from 'mongoose';

const withMongoTransaction = async (
    callback: (session: ClientSession) => Promise<void>
) => {


    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        // check if trx is still active before aborting
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    }
    finally {
        await session.endSession();
    }

}

export default withMongoTransaction;