import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
        IonButtons, IonBackButton, IonIcon, useIonViewWillEnter, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import './AuthorsPage.css';
import { save } from 'ionicons/icons';

import sqliteParams from '../databases/sqliteParams';
import authorDataSource from '../databases/datasources/AuthorDataSource';
import { Post } from '../databases/entities/author/post';
import { Category } from '../databases/entities/author/category';
import { Author } from '../databases/entities/author/author';
import { getCountOfElements } from '../databases/utilities';
import PostList from '../components/PostList/PostList';
import AuthorList from '../components/AuthorList/AuthorList';
import CategoryList from '../components/CategoryList/CategoryList';
import { useWebPersistence } from '../hooks/useWebPersistence';

type SegmentType = 'authors' | 'posts' | 'categories';

const AuthorsPage: React.FC = () => {
    const [initialRef, setInitialRef] = useState(false);
    const [isWeb, setIsWeb] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedSegment, setSelectedSegment] = useState('authors');
    let errMess = '';

    const connection = authorDataSource.dataSource;
    const database = authorDataSource.dbName;

    // Automatically save to web store when data changes
    useWebPersistence([authors, categories, posts]);

    const createAuthor = async (name:string, email:string): Promise<Author> => {
        const author = new Author();
        author.name = name;
        author.email = email;
        const authorRepository = connection.getRepository(Author);
        let authorToUpdate = await authorRepository.findOne({
            where: {
            email: author.email,
            },
        });
        if (authorToUpdate != null) {
            author.id = authorToUpdate.id;
        }
        await authorRepository.save(author);
        return author;
    };
    const createCategory = async (name: string): Promise<Category> => {
        const category = new Category();
        category.name = name;
        const categoryRepository = connection.getRepository(Category);
        let categoryToUpdate = await categoryRepository.findOne({
          where: {
            name: category.name,
          },
        });
        if (categoryToUpdate != null) {
            category.id = categoryToUpdate.id;
        }
        await categoryRepository.save(category);
        return category;
    }; 
    const createPost = async (title: string, text: string, author:Author,
                              categories: Category[]): Promise<void> => {

        const post = new Post();
        post.title = title;
        post.text = text;
        post.author = author;
        post.categories = categories;
        const postRepository = connection.getRepository(Post);
        let postToUpdate = await postRepository.findOne({
          where: {
            title: post.title,
          },
        });
        if (postToUpdate != null) {
            post.id = postToUpdate.id;
        }
        await postRepository.save(post);
        return ;
    };

    const loadData = async () => {
        try {
            setIsWeb(sqliteParams.platform === 'web' ? true : false);
            const countAuthor = await getCountOfElements(connection, Author);
            if (countAuthor === 0 ) {
                // Create some Authors
                const author1 = await createAuthor('JeepQ', 'jeepq@example.com');
                const author2 = await createAuthor('Rosenwasser', 'rosenwasser@example.com');
                // Create some Categories
                const categ1 = await createCategory('Typescript');
                const categ2 = await createCategory('Programming');
                const categ3 = await createCategory('Tutorial');
                // Create some Posts
                await createPost('Announcing TypeScript 5.0',
                'This release brings many new features, while aiming to make TypeScript smaller, simpler, and faster...',
                author2,[categ1,categ2])
                await createPost('Ionic 7 SQLite Database CRUD App Example Tutorial using Angular and @capacitor-community/sqlite',
                'In that tutorial we will learned how to create a Ionic7/Angular basic CRUD application and implement the @capacitor-community/sqlite plugin to store the data in a SQLite database...',
                author1,[categ1,categ2,categ3])
                await createPost('Ionic 7 VideoPlayer App Example Tutorial using Angular and capacitor-video-player plugin',
                'In this tutorial, we will learn how to create a simple Ionic7/Angular video player application by implementing the capacitor-video-player plugin to display a list of videos with some data and play a selected video in fullscreen mode...',
                author1,[categ1,categ2,categ3])
                if (isWeb) {        
                    await sqliteParams.connection.saveToStore(database);
                }
            }
            await refreshData();
        } catch (e) {
            console.log((e as any).message);
            errMess = `Error: ${(e as any).message}`;
        }               
    };

    const refreshData = async () => {
        setAuthors(await connection.manager.find(Author));
        setCategories(await connection.manager.find(Category));
        setPosts(await connection
                .createQueryBuilder(Post,'post')
                .innerJoinAndSelect('post.author', 'author')
                .innerJoinAndSelect('post.categories', 'categories')
                .orderBy('author.name,post.title')
                .getMany());
    };
              
    const handleSave = (async () => {
        await sqliteParams.connection.saveToStore(database);
        // write database to local disk for development only
        await sqliteParams.connection.saveToLocalDisk(database);
    });

    useIonViewWillEnter( () => {
        if(initialRef === false) {
            loadData();
            setInitialRef(true);
          }
    });

    useEffect(() => {
        // Remove aria-hidden from router outlet when this page is active
        const routerOutlet = document.getElementById('main-content');
        if (routerOutlet) {
            routerOutlet.removeAttribute('aria-hidden');
        }

        return () => {
            // Clean up when component unmounts
            const routerOutlet = document.getElementById('main-content');
            if (routerOutlet) {
                routerOutlet.setAttribute('aria-hidden', 'false');
            }
        };
    }, []);

    return (
        <IonPage className="AuthorPage" role="main">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Authors DB</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton text="home" defaultHref="/home"></IonBackButton>
                    </IonButtons>
                    {isWeb && (
                        <IonButtons slot="end">
                            <IonIcon 
                                icon={save} 
                                onClick={handleSave} 
                                role="button" 
                                aria-label="Save database"
                                style={{ cursor: 'pointer' }}
                            ></IonIcon>
                        </IonButtons>
                    )}
                </IonToolbar>
                <IonToolbar>
                    <IonSegment 
                        value={selectedSegment} 
                        onIonChange={e => setSelectedSegment(e.detail.value as SegmentType)} 
                        role="tablist"
                    >
                        <IonSegmentButton value="authors" role="tab">
                            <IonLabel>Authors</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="posts" role="tab">
                            <IonLabel>Posts</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="categories" role="tab">
                            <IonLabel>Categories</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent role="region" aria-label="Main content">
                {initialRef && (
                    <div role="main">
                        {errMess.length > 0 && (
                            <IonCard role="alert">
                                <p>{errMess}</p>
                            </IonCard>
                        )}
                        {selectedSegment === 'authors' ? (
                            <AuthorList authors={authors} onAuthorsChange={refreshData} />
                        ) : selectedSegment === 'posts' ? (
                            <PostList posts={posts} onPostsChange={refreshData} />
                        ) : (
                            <CategoryList categories={categories} onCategoriesChange={refreshData} />
                        )}
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default AuthorsPage;
