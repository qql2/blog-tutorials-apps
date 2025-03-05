import React, { useState } from 'react';
import './AuthorList.css';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, 
         IonListHeader, IonCard, IonCardHeader, IonCardTitle, 
         IonCardContent, IonModal, IonContent } from '@ionic/react';
import { create, trash, pencil } from 'ionicons/icons';
import { Author } from '../../databases/entities/author/author';
import authorDataSource from '../../databases/datasources/AuthorDataSource';
import AuthorForm from '../AuthorForm/AuthorForm';

interface AuthorListProps {
  authors: Author[];
  onAuthorsChange: () => void;
}

const AuthorList: React.FC<AuthorListProps> = ({ authors, onAuthorsChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const handleDelete = async (author: Author) => {
    try {
      const connection = authorDataSource.dataSource;
      await connection.manager.remove(author);
      onAuthorsChange();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedAuthor(null);
    setShowModal(true);
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setSelectedAuthor(null);
  };

  return (
    <div className="AuthorList">
      <IonList>
        <IonListHeader>
          <IonLabel>Authors</IonLabel>
          <IonButton fill="clear" onClick={handleAdd}>
            <IonIcon icon={create} />
            Add Author
          </IonButton>
        </IonListHeader>
        {authors.map((author) => (
          <IonCard key={author.id}>
            <IonCardHeader>
              <IonCardTitle>{author.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem lines="none">
                <IonLabel>
                  <p>Email: {author.email}</p>
                  <p>Company: {author.company}</p>
                  <p>Birthday: {author.birthday}</p>
                </IonLabel>
                <IonButton fill="clear" onClick={() => handleEdit(author)}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => handleDelete(author)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={handleModalDismiss}>
        <IonContent>
          <AuthorForm
            author={selectedAuthor}
            onSave={() => {
              handleModalDismiss();
              onAuthorsChange();
            }}
            onCancel={handleModalDismiss}
          />
        </IonContent>
      </IonModal>
    </div>
  );
};

export default AuthorList; 