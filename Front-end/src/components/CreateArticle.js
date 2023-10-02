import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AppContext} from "./AppContext";

const CreateArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [picture, setPicture] = useState("");
    const [features, setFeatures] = useState("");
    const {isAdmin} = useContext(AppContext);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [stock, setStock] = useState("");
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [weight, setWeight] = useState("");

    useEffect(() => {
        if (categoryId) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/subcategories/${categoryId}`)
                .then((response) => {
                    setSubCategories(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des sous-catégories:", error);
                });
        } else {
            setSubCategories([]);
        }
    }, [categoryId]);


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des catégories:", error);
            });
    }, []);

    if (!isAdmin) {
        navigate("/");
        return null;
    }

    const submitForm = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const articleData = {
            title: title,
            content: content,
            price: price,
            category_id: categoryId,
            subcategory_id: subCategoryId,
            picture: picture,
            features: features,
            stock: stock,
            weight: weight,
        };

        axios
            .post(
                `${process.env.REACT_APP_API_URL}/admin/create_article`, articleData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                }
            )
            .then((response) => {
                const articleId = response.data.article.id;
                navigate(`/article/${articleId}`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Une erreur est survenue lors de la création de l'article:", error);
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors([...errors, error.response.data.message]);
                } else {
                    setErrors([...errors, "Une erreur est survenue lors de la création de l'article."]);
                }
                setIsLoading(false);
            });

    };

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <Card className="p-4 border">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">
                                Créer un article
                            </Card.Title>
                            <Form onSubmit={submitForm}>
                                <Form.Group controlId="articleTitle" className="mb-3">
                                    <Form.Label>Titre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez le titre de l'article"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articleContent" className="mb-3">
                                    <Form.Label>Contenu</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Entrez le contenu de l'article"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articleCategoryId" className="mb-3">
                                    <Form.Label>Catégorie</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">Sélectionnez une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="articleSubCategoryId" className="mb-3">
                                    <Form.Label>Sous-catégorie</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={subCategoryId}
                                        onChange={(e) => setSubCategoryId(e.target.value)}
                                    >
                                        <option value="">Sélectionnez une sous-catégorie</option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory.id} value={subCategory.id}>
                                                {subCategory.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>


                                <Form.Group controlId="articlePicture" className="mb-3">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez l'URL de l'image"
                                        value={picture}
                                        onChange={(e) => setPicture(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articleWeight" className="mb-3">
                                    <Form.Label>Poids (en kg)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez le poids de l'article en kg"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articleCharacteristic" className="mb-3">
                                    <Form.Label>Caractéristique</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez une caractéristique"
                                        value={features}
                                        onChange={(e) => setFeatures(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articlePrice" className="mb-3">
                                    <Form.Label>Prix</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez le prix de l'article"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="articleStock" className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez le stock de l'article"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" disabled={isLoading}>
                                        {isLoading ? 'Chargement...' : 'Soumettre'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default CreateArticle;
