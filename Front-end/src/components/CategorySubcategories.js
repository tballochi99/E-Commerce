import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import {Breadcrumb, Card, Col, Container, Row, Spinner} from "react-bootstrap";

function CategorySubcategories() {
    const {categoryId} = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [subCategoryName, setSubCategoryName] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/category/${categoryId}/subcategories`)
            .then(response => {
                const data = response.data;
                if (data.length > 0) {
                    setCategoryName(data[0].category.name);
                    setSubcategories(data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, [categoryId]);


    if (isLoading) {
        return (
            <div className="full-page-spinner">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h2 className="font-sans">Sous-catégories de {categoryName}</h2>
                </Col>
            </Row>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Accueil</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link}
                                 linkProps={{to: `/category/${categoryId}/subcategories`}}>{categoryName}</Breadcrumb.Item>
                <Breadcrumb.Item active>{subCategoryName}</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                {subcategories.map(subcategory => (
                    <Col sm={12} md={6} lg={4} xl={3} key={subcategory.id} className="mb-3">
                        <Card className="h-100 p-3 hover:bg-gray-100 ease-in duration-100 overflow-hidden group">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="hover:text-blue-500">
                                    <Link to={`/subcategory/${subcategory.id}/articles`}>
                                        {subcategory.name}
                                    </Link>
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default CategorySubcategories;
