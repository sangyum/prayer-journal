import { Logger } from "../logger";
import { chunk } from "lodash";
import { DataAccessLayer } from ".";

const FirestoreDAL = (db: FirebaseFirestore.Firestore, logger: Logger) => <Type, >(collectionPath: string): DataAccessLayer => {
    const collectionRef = db.collection(collectionPath);
    
    const getAll = async (): Promise<any[]> => {
        try {
            const querySnapshot = await collectionRef.get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const getById = async (id: string): Promise<any> => {

        try {
            const docRef = collectionRef.doc(id);
    
            const doc = await docRef.get();
            if (doc.exists) {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            } else {
                return undefined;
            }
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const search = async (field: string, operator: string, value: any): Promise<any[]> => {
        try {
            const query = collectionRef.where(field, operator as FirebaseFirestore.WhereFilterOp, value);

            const querySnapshot = await query.get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    const add = async (document: any): Promise<string> => {
        try {
            const docRef = await collectionRef.add(document);
            return docRef.id;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    const addMultiple = async (documents: any[]): Promise<void> => {
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

    const update = async (document: FirebaseFirestore.DocumentData): Promise<void> => {
        try {
            const docRef = collectionRef.doc(document.id);
            
            await docRef.update(document);
        } catch (error) {
            logger.error(error);
            throw error;            
        }
    }

    const remove = (document: FirebaseFirestore.DocumentData) => collectionRef.doc(document.id).delete();

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