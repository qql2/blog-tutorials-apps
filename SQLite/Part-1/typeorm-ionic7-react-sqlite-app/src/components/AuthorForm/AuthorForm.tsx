import React, { useState, useEffect } from 'react';
import './AuthorForm.css';
import { IonContent, IonItem, IonInput, IonButton, 
         IonDatetime, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { Author } from '../../databases/entities/author/author';
import authorDataSource from '../../databases/datasources/AuthorDataSource';

interface AuthorFormProps {
  author: Author | null;
  onSave: () => void;
  onCancel: () => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({ author, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [birthday, setBirthday] = useState<string | null>(null);

  useEffect(() => {
    if (author) {
      setName(author.name);
      setEmail(author.email);
      setCompany(author.company || '');
      setBirthday(author.birthday || null);
    }
  }, [author]);

  const handleSubmit = async () => {
    try {
      const connection = authorDataSource.dataSource;
      const authorRepository = connection.getRepository(Author);
      
      const authorToSave = author || new Author();
      authorToSave.name = name;
      authorToSave.email = email;
      authorToSave.company = company;
      authorToSave.birthday = birthday || '';

      await authorRepository.save(authorToSave);
      onSave();
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  return (
    <div className="AuthorForm">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{author ? 'Edit Author' : 'Add Author'}</IonTitle>
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

          <IonItem>
            <IonInput
              label="Email"
              labelPlacement="stacked"
              type="email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Company"
              labelPlacement="stacked"
              value={company}
              onIonChange={e => setCompany(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonDatetime
              value={birthday || undefined}
              onIonChange={e => setBirthday(typeof e.detail.value === 'string' ? e.detail.value : null)}
              presentation="date"
              locale="zh-CN"
            >
              <div slot="title">选择生日</div>
            </IonDatetime>
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

export default AuthorForm;
