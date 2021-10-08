import { Logger } from "../logger";
import { chunk } from "lodash";
import { DataAccessLayer } from ".";

const FirestoreDAL = (db: FirebaseFirestore.Firestore, logger: Logger) => <Type, >(collectionPath: string): DataAccessLayer<Type> => {
    const collectionRef = db.collection(collectionPath);
    
    const getAll = async (): Promise<Type[]> => {
        try {
            const querySnapshot = await collectionRef.get();
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    ...data
                }})
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const getById = async (id: string): Promise<Type | undefined> => {

        try {
            const docRef = collectionRef.doc(id);
    
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    ...data
                }
            } else {
                return undefined;
            }
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const search = async (field: string, operator: string, value: any): Promise<Type[]> => {
        try {
            const query = collectionRef.where(field, operator as FirebaseFirestore.WhereFilterOp, value);

            const querySnapshot = await query.get();
            return querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                    id: doc.id,
                    ...data
                }})
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const add = async (document: any): Promise<void> => {
        try {
            await collectionRef.add(document);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    const addMultiple = async (documents: Type[]): Promise<void> => {
        try {
            const chunks = chunk(documents, 500);
            const promises = chunks.map(chunk => batchAdd(chunk));

            await Promise.all(promises);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    const batchAdd = async (documents: any[]): Promise<FirebaseFirestore.WriteResult[]> => {
        try {
            const batch = db.batch();

            documents.forEach(document => {
                const newDocRef = collectionRef.doc();
                batch.set(newDocRef, document);
            });
            return batch.commit();
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    const update = async (document: Type): Promise<void> => {
        try {
            const docRef = collectionRef.doc(document.id);
            
            await docRef.update(document);
        } catch (error) {
            logger.error(error);
            throw error;            
        }
    }

    const remove = async (id: string) => {
        await collectionRef.doc(id).delete();
    }

    return {
        getAll,
        getById,
        search,
        add,
        addMultiple,
        update,
        remove
    }
}

export default FirestoreDAL;