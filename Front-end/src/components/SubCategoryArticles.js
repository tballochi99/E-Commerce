import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import {Breadcrumb, Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {AppContext} from "./AppContext";

function SubCategoryArticles() {
    const {subCategoryId} = useParams();
    const [subCategoryName, setSubCategoryName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryId, setCategoryId] = useState(null);
    const {addToCart, loadingCartOperation} = useContext(AppContext);


    const renderArticle = (article, prefix = '') => (
        <Col sm={12} md={6} lg={4} xl={3} key={`${prefix}-${article.id}`} className="mb-3">
            <Link to={`/article/${article.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <Card className="h-100 p-3 hover:bg-gray-100 ease-in duration-100 overflow-hidden group clickable-card">
                    <div className="w-[200px] h-[200px] flex justify-center rounded-md overflow-hidden mx-auto">
                        <Card.Img
                            className="hover:scale-125 hover:rotate-2 transition-all"
                            variant="top"
                            src={article.picture}
                            style={{objectFit: "cover", height: "200px"}}
                        />
                    </div>
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="hover:text-blue-500">
                            {article.title}
                        </Card.Title>
                        <Card.Text>{article.content.slice(0, 20)}...</Card.Text>
                        <Card.Text className="hover:text-blue-500 hover:font-semibold">
                            {article.discount ? (
                                <span>
                                <span className="line-through mr-2">{article.price.toFixed(2)}€</span>
                                <strong className="text-primary">
                                    {(article.price * (1 - article.discount / 100)).toFixed(2)}€
                                </strong>
                                <span className="text-red-500 ml-2">-{article.discount}%</span>
                            </span>
                            ) : (
                                <span>Prix: {article.price.toFixed(2)}€</span>
                            )}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-gray-100/30 p-3">
                        <Row>
                            <Col>
                                {article.stock > 0 ? (
                                    <Button
                                        className="text-white bg-gradient-to-r w-52 mb-1 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 flex m-auto justify-center transition-all duration-100"
                                        variant="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addToCart(article);
                                        }}
                                        disabled={loadingCartOperation}
                                    >
                                        {loadingCartOperation ? 'Chargement...' : 'Ajouter au panier'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        disabled
                                        className="w-52 mt-1 flex m-auto justify-center"
                                    >
                                        Indisponible
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Link>
        </Col>
    );


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/subcategories/${subCategoryId}/articles`)
            .then(response => {
                if (response.data.length > 0) {
                    setSubCategoryName(response.data[0].sub_category.name);
                    setCategoryName(response.data[0].sub_category.category.name);
                    setCategoryId(response.data[0].sub_category.category.id); // Ajoutez cette ligne
                }
                setArticles(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, [subCategoryId]);


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
                    <h2 className="font-sans">Articles de {subCategoryName}</h2>
                </Col>
            </Row>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Accueil</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link}
                                 linkProps={{to: `/category/${categoryId}/subcategories`}}>{categoryName}</Breadcrumb.Item>
                <Breadcrumb.Item active>{subCategoryName}</Breadcrumb.Item>
            </Breadcrumb>


            <Row>{articles.map(article => renderArticle(article))}</Row>
        </Container>
    );
}

export default SubCategoryArticles;
