import { useEffect } from 'react';
import sqliteParams from '../databases/sqliteParams';
import authorDataSource from '../databases/datasources/AuthorDataSource';

/**
 * Custom hook to automatically handle web persistence for SQLite database
 * @param dependencies - Array of dependencies that should trigger a save operation
 */
export const useWebPersistence = (dependencies: any[] = []) => {
  useEffect(() => {
    const saveData = async () => {
      if (sqliteParams.platform === 'web') {
        try {
          await sqliteParams.connection.saveToStore(authorDataSource.dbName);
        } catch (error) {
          console.error('Error saving data to IndexedDB:', error);
        }
      }
    };

    saveData();
  }, dependencies);
};

/**
 * Manually trigger a save operation for web persistence
 */
export const saveToWebStore = async () => {
  if (sqliteParams.platform === 'web') {
    try {
      await sqliteParams.connection.saveToStore(authorDataSource.dbName);
    } catch (error) {
      console.error('Error saving data to IndexedDB:', error);
    }
  }
}; 