import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    setDoc,
    updateDoc
} from "firebase/firestore";

/**
 * Firestore utility helpers for generic CRUD operations + real-time listeners
 * @param db - Firestore instance
 */
export const firestoreUtils = <T extends { id?: string }>(db: Firestore, collectionName: string) => {
    const colRef = collection(db, collectionName);

    return {
        async create(data: T): Promise<T> {
            if (!data.id) {
                throw new Error("ID is required to create a document with a specific ID");
            }
            const docRef = doc(colRef, data.id); // use given ID
            await setDoc(docRef, data);
            return data;
        },

        async getById(id: string): Promise<T | null> {
            const docSnap = await getDoc(doc(db, collectionName, id));
            return docSnap.exists() ? ({id: docSnap.id, ...docSnap.data()} as T) : null;
        },

        async getAll(
            order?: { field: string; direction?: "asc" | "desc" }
        ): Promise<T[]> {
            const q = order
                ? query(colRef, orderBy(order.field, order.direction ?? "asc"))
                : colRef;

            const querySnap = await getDocs(q);
            return querySnap.docs.map(doc => ({id: doc.id, ...doc.data()} as T));
        },

        async update(id: string, data: Partial<Omit<T, "id">>): Promise<T | null> {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
            const updatedSnap = await getDoc(docRef);
            return updatedSnap.exists() ? ({id: updatedSnap.id, ...updatedSnap.data()} as T) : null;
        },

        async remove(id: string): Promise<void> {
            await deleteDoc(doc(db, collectionName, id));
        },

        /**
         * Subscribe to all docs in the collection
         * @param callback Function to run on snapshot update
         * @returns unsubscribe function
         */
        onSnapshotAll(callback: (items: T[]) => void) {
            return onSnapshot(colRef, (snapshot) => {
                const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as T));
                callback(items);
            });
        },

        /**
         * Subscribe to a single document
         * @param id Document ID
         * @param callback Function to run on snapshot update
         * @returns unsubscribe function
         */
        onSnapshotById(id: string, callback: (item: T | null) => void) {
            const docRef = doc(db, collectionName, id);
            return onSnapshot(docRef, (docSnap) => {
                callback(docSnap.exists() ? ({id: docSnap.id, ...docSnap.data()} as T) : null);
            });
        },

        /**
         * Subscribe to query results
         * @param constraints Firestore query constraints (e.g., where, orderBy)
         * @param callback Function to run on snapshot update
         * @returns unsubscribe function
         */
        onSnapshotQuery(constraints: QueryConstraint[], callback: (items: T[]) => void) {
            const q = query(colRef, ...constraints);
            return onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as T));
                callback(items);
            });
        }
    };
};
