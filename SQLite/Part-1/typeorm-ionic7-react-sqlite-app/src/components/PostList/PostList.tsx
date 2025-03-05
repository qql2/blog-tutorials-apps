import React, { useState } from 'react';
import './PostList.css';
import { IonList, IonLabel, IonListHeader, IonCard, IonCardHeader,
         IonCardTitle, IonCardSubtitle, IonCardContent, IonButton,
         IonIcon, IonModal, IonContent } from '@ionic/react';
import { create, trash, pencil } from 'ionicons/icons';
import { Post } from '../../databases/entities/author/post';
import authorDataSource from '../../databases/datasources/AuthorDataSource';
import PostForm from '../PostForm/PostForm';

interface PostListProps {
  posts: Post[];
  onPostsChange?: () => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostsChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getCategories = (post: Post) => {
    const categories: string = post.categories.map(cat => cat.name).join(", ");
    return categories;
  };

  const handleDelete = async (post: Post) => {
    try {
      const connection = authorDataSource.dataSource;
      await connection.manager.remove(post);
      onPostsChange?.();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedPost(null);
    setShowModal(true);
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="PostList">
      <IonList>
        <IonListHeader>
          <IonLabel>Posts</IonLabel>
          <IonButton fill="clear" onClick={handleAdd}>
            <IonIcon icon={create} />
            Add Post
          </IonButton>
        </IonListHeader>
        {posts.map((post) => (
          <IonCard key={post.id}>
            <IonCardHeader>
              <IonCardTitle>{post.title}</IonCardTitle>
              <IonCardSubtitle className="post-author-subtitle">{post.author.name}</IonCardSubtitle>
              <IonCardSubtitle className="post-categories-subtitle">{getCategories(post)}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel>{post.text}</IonLabel>
              <div className="post-actions">
                <IonButton fill="clear" onClick={() => handleEdit(post)}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => handleDelete(post)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={handleModalDismiss} className="post-modal">
        <IonContent className="ion-padding">
          <PostForm
            post={selectedPost}
            onSave={() => {
              handleModalDismiss();
              onPostsChange?.();
            }}
            onCancel={handleModalDismiss}
          />
        </IonContent>
      </IonModal>
    </div>
  );
};

export default PostList;
