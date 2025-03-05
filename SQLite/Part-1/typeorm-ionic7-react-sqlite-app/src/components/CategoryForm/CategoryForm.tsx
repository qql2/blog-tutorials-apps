import React, { useState, useEffect } from 'react';
import './CategoryForm.css';
import { IonContent, IonItem, IonInput, IonButton,
         IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { Category } from '../../databases/entities/author/category';
import authorDataSource from '../../databases/datasources/AuthorDataSource';
import { useWebPersistence } from '../../hooks/useWebPersistence';

interface CategoryFormProps {
  category: Category | null;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async () => {
    try {
      const connection = authorDataSource.dataSource;
      const categoryRepository = connection.getRepository(Category);

      const categoryToSave = category || new Category();
      categoryToSave.name = name;

      await categoryRepository.save(categoryToSave);
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="CategoryForm">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{category ? 'Edit Category' : 'Add Category'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <IonItem>
            <IonInput
              label="Name"
              labelPlacement="stacked"
              value={name}
              onIonChange={e => setName(e.detail.value!)}
              required
            />
          </IonItem>

          <div className="ion-padding">
            <IonButton expand="block" onClick={handleSubmit}>
              Save
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={onCancel}>
              Cancel
            </IonButton>
          </div>
        </form>
      </IonContent>
    </div>
  );
};

export default CategoryForm; 