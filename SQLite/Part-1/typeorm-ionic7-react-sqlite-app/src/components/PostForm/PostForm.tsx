import React, { useState, useEffect } from 'react';
import './PostForm.css';
import { IonContent, IonItem, IonInput, IonButton, 
         IonTextarea, IonHeader, IonToolbar, IonTitle, IonSelect,
         IonSelectOption, 
         IonText} from '@ionic/react';
import { Post } from '../../databases/entities/author/post';
import { Author } from '../../databases/entities/author/author';
import { Category } from '../../databases/entities/author/category';
import authorDataSource from '../../databases/datasources/AuthorDataSource';

interface PostFormProps {
  post: Post | null;
  onSave: () => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();
    if (post) {
      setTitle(post.title);
      setText(post.text);
      setSelectedAuthorId(post.author.id);
      setSelectedCategoryIds(post.categories.map(cat => cat.id));
    }
  }, [post]);

  const loadData = async () => {
    const connection = authorDataSource.dataSource;
    setAuthors(await connection.manager.find(Author));
    setCategories(await connection.manager.find(Category));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedAuthorId) {
        alert('Please select an author');
        return;
      }
      if (selectedCategoryIds.length === 0) {
        alert('Please select at least one category');
        return;
      }

      const connection = authorDataSource.dataSource;
      const postRepository = connection.getRepository(Post);
      const authorRepository = connection.getRepository(Author);
      const categoryRepository = connection.getRepository(Category);

      const author = await authorRepository.findOneBy({ id: selectedAuthorId });
      const selectedCategories = await categoryRepository.findByIds(selectedCategoryIds);

      if (!author) {
        throw new Error('Author not found');
      }

      const postToSave = post || new Post();
      postToSave.title = title;
      postToSave.text = text;
      postToSave.author = author;
      postToSave.categories = selectedCategories;

      await postRepository.save(postToSave);
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="PostForm">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{post ? 'Edit Post' : 'Add Post'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="stacked"
              value={title}
              onIonChange={e => setTitle(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonText>
              test
            </IonText>
          </IonItem>
          <IonItem>
            <IonTextarea
              label="Content"
              labelPlacement="stacked"
              value={text}
              onIonChange={e => setText(e.detail.value!)}
              required
              rows={6}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Author"
              labelPlacement="stacked"
              value={selectedAuthorId}
              onIonChange={e => setSelectedAuthorId(e.detail.value)}
            >
              {authors.map(author => (
                <IonSelectOption key={author.id} value={author.id}>
                  {author.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonSelect
              label="Categories"
              labelPlacement="stacked"
              value={selectedCategoryIds}
              multiple={true}
              onIonChange={e => setSelectedCategoryIds(e.detail.value)}
            >
              {categories.map(category => (
                <IonSelectOption key={category.id} value={category.id}>
                  {category.name}
                </IonSelectOption>
              ))}
            </IonSelect>
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

export default PostForm; 