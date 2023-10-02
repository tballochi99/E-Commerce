import React, {useEffect, useState} from 'react';
import {Breadcrumb, Card, Col, Container, ListGroup, Row} from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';


function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleCategoryClick = (category) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/subcategories/${category.id}`)
            .then((response) => {
                setSelectedCategory({...category, subcategories: response.data});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container className="mt-4">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Accueil</Breadcrumb.Item>
                <Breadcrumb.Item active>Catégories</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col md={4}>
                    <h3>Catégories</h3>
                    <Card className="mb-3">
                        <ListGroup variant="flush">
                            {categories.map((category) => (
                                <ListGroup.Item
                                    key={category.id}
                                    action
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={8}>
                    {selectedCategory && selectedCategory.subcategories && (
                        <>
                            <h3>Sous-catégories de {selectedCategory.name}</h3>
                            <Card>
                                <ListGroup variant="flush">
                                    {selectedCategory.subcategories.map((subcategory) => (
                                        <ListGroup.Item key={subcategory.id}>
                                            <Link to={`/subcategory/${subcategory.id}/articles`}
                                                  className="text-decoration-none">
                                                {subcategory.name}
                                            </Link>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default CategoryPage;
