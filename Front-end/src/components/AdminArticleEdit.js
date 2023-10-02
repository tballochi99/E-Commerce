import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "./AppContext";
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';

function AdminArticleEdit() {
    const {isAdmin} = useContext(AppContext);
    const navigate = useNavigate();
    const {id} = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState("");
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('jwtToken');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        features: "",
        picture: '',
        price: "",
        stock: "",
        category_id: "",
        discount: 0,
        isRecommended: false,
        weight: "",
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (formData.category_id) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/subcategories/${formData.category_id}`)
                .then((response) => {
                    setSubCategories(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des sous-catégories:", error);
                });
        } else {
            setSubCategories([]);
        }
    }, [formData.category_id]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        if (id) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/article/${id}`)
                .then((response) => {
                    setFormData(response.data);
                    setSubCategoryId(response.data.sub_category.id)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const articleData = {
            ...formData,
        };

        const axiosConfig = id ?
            axios.put(`${process.env.REACT_APP_API_URL}/article/${id}`, articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }) :
            axios.post(`${process.env.REACT_APP_API_URL}/admin/article`, articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        axiosConfig.then((response) => {
            navigate(id ? `/article/${id}` : "/");
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({general: "Une erreur est survenue."});
            }
        });
    };

    if (!isAdmin) {
        navigate("/");
        return null;
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <Card className="p-4 border">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">
                                {id ? 'Modifier un article' : 'Créer un article'}
                            </Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="articleTitle" className="mb-3">
                                    <Form.Label>Titre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Entrez le titre de l'article"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                    {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articleCategoryId" className="mb-3">
                                    <Form.Label>Catégorie</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                    >
                                        {errors.category_id &&
                                            <Form.Text className="text-danger">{errors.category_id}</Form.Text>}
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
                                        name="sub_category_id"
                                        value={subCategoryId}
                                        onChange={(e) => {
                                            const {value} = e.target;
                                            setSubCategoryId(value);
                                            setFormData(prevState => ({
                                                ...prevState,
                                                sub_category: {
                                                    ...prevState.sub_category,
                                                    id: value
                                                }
                                            }));
                                        }}
                                    >
                                        <option value="">Sélectionnez une sous-catégorie</option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory.id} value={subCategory.id}>
                                                {subCategory.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {errors.sub_category_id &&
                                        <Form.Text className="text-danger">{errors.sub_category_id}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articleIsRecommended" className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Recommandé"
                                        name="isRecommended"
                                        checked={formData.isRecommended}
                                        onChange={e => setFormData({
                                            ...formData,
                                            [e.target.name]: e.target.checked,
                                        })}
                                    />
                                    {errors.isRecommended &&
                                        <Form.Text className="text-danger">{errors.isRecommended}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articleDiscount" className="mb-3">
                                    <Form.Label>Rabais</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="discount"
                                        placeholder="Entrez le rabais pour l'article"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                    {errors.discount &&
                                        <Form.Text className="text-danger">{errors.discount}</Form.Text>}
                                </Form.Group>
                                <Form.Group controlId="articleWeight" className="mb-3">
                                    <Form.Label>Poids</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="weight"
                                        placeholder="Entrez le poids de l'article"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                    {errors.weight && <Form.Text className="text-danger">{errors.weight}</Form.Text>}
                                </Form.Group>
                                <Form.Group controlId="articleContent" className="mb-3">
                                    <Form.Label>Contenu</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="content"
                                        placeholder="Entrez le contenu de l'article"
                                        value={formData.content}
                                        onChange={handleChange}
                                    />
                                    {errors.content && <Form.Text className="text-danger">{errors.content}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articleCharacteristic" className="mb-3">
                                    <Form.Label>Caractéristique</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="features"
                                        placeholder="Entrez une caractéristique"
                                        value={formData.features}
                                        onChange={handleChange}
                                    />
                                    {errors.features &&
                                        <Form.Text className="text-danger">{errors.features}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articlePicture" className="mb-3">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="picture"
                                        placeholder="Entrez une image"
                                        value={formData.picture}
                                        onChange={handleChange}
                                    />
                                    {errors.picture && <Form.Text className="text-danger">{errors.picture}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articlePrice" className="mb-3">
                                    <Form.Label>Prix</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        placeholder="Entrez le prix de l'article"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                    {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="articleStock" className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        placeholder="Entrez le stock de l'article"
                                        value={formData.stock}
                                        onChange={handleChange}
                                    />
                                    {errors.stock && <Form.Text className="text-danger">{errors.stock}</Form.Text>}
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
        </Container>
    );
}

export default AdminArticleEdit;
