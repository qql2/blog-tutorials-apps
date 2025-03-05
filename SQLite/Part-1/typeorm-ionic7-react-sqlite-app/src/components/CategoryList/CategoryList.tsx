import React, { useState } from 'react';
import './CategoryList.css';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, 
         IonListHeader, IonCard, IonCardHeader, IonCardTitle, 
         IonCardContent, IonModal, IonContent } from '@ionic/react';
import { create, trash, pencil } from 'ionicons/icons';
import { Category } from '../../databases/entities/author/category';
import authorDataSource from '../../databases/datasources/AuthorDataSource';
import { useWebPersistence } from '../../hooks/useWebPersistence';
import CategoryForm from '../CategoryForm/CategoryForm';

interface CategoryListProps {
  categories: Category[];
  onCategoriesChange: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onCategoriesChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Automatically save to web store when categories change
  useWebPersistence([categories]);

  const handleDelete = async (category: Category) => {
    try {
      const connection = authorDataSource.dataSource;
      await connection.manager.remove(category);
      onCategoriesChange();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="CategoryList">
      <IonList>
        <IonListHeader>
          <IonLabel>Categories</IonLabel>
          <IonButton fill="clear" onClick={handleAdd}>
            <IonIcon icon={create} />
            Add Category
          </IonButton>
        </IonListHeader>
        {categories.map((category) => (
          <IonCard key={category.id}>
            <IonCardHeader>
              <IonCardTitle>{category.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="category-actions">
                <IonButton fill="clear" onClick={() => handleEdit(category)}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => handleDelete(category)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={handleModalDismiss}>
        <IonContent>
          <CategoryForm
            category={selectedCategory}
            onSave={() => {
              handleModalDismiss();
              onCategoriesChange();
            }}
            onCancel={handleModalDismiss}
          />
        </IonContent>
      </IonModal>
    </div>
  );
};

export default CategoryList; 