import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Button, Card, Col, Container, Form, Pagination, Row, Spinner} from "react-bootstrap";
import {useDebounce} from "@uidotdev/usehooks";
import {AppContext} from "./AppContext";
import {motion} from "framer-motion";

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [popularArticles, setPopularArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchName, setSearchName] = useState("");
    const debouncedSearchName = useDebounce(searchName, 300);
    const [recommendedArticles, setRecommendedArticles] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 8;
    const [searchCategory, setSearchCategory] = useState("");
    const [pagesCount, setPagesCount] = useState(1);
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
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .all([
                axios.get(`${process.env.REACT_APP_API_URL}/article/popular`),
                axios.get(`${process.env.REACT_APP_API_URL}/article/recommended`),
            ])
            .then(
                axios.spread((popularArticlesResponse, recommendedArticlesResponse) => {
                    setPopularArticles(popularArticlesResponse.data.slice(0, 4));
                    setRecommendedArticles(recommendedArticlesResponse.data);
                    setIsLoading(false);
                })
            )
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });

    }, []);


    useEffect(() => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/article/search?name=${debouncedSearchName}&category=${searchCategory}`
            )
            .then((response) => {
                setArticles(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [debouncedSearchName, searchCategory]);

    useEffect(() => {
        if (debouncedSearchName.length > 2) {
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/article/search?name=${debouncedSearchName}`
                )
                .then((response) => {
                    setSuggestions(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setSuggestions([]);
        }
    }, [debouncedSearchName]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/article?page=${page}&limit=${limit}`)
            .then((response) => {
                setArticles(response.data.items);
                setPagesCount(response.data.pages_count);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });

        window.scrollTo(0, 0);
    }, [page]);


    const handleNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
    };

    const nextPage = () => {
        if (page < pagesCount) {
            setPage(page + 1);
        }
    };


    const prevPage = () => {
        setPage(page - 1);
    };

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
        <motion.div>
            <Container>
                <Col className="mt-3">
                    <h2 className="font-sans">ACTUALITÉ ET NOUVEAUTÉ</h2>
                </Col>
                <Row className="mb-3">
                    <Col>
                        <div>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={searchName}
                                onChange={handleNameChange}
                            />
                            {/*{suggestions.length > 0 && (*/}
                            {/*    <ul className="list-group suggestions-list">*/}
                            {/*        {suggestions.map((suggestion) => (*/}
                            {/*            <li key={suggestion.id} className="list-group-item">*/}
                            {/*                <Link to={`/article/${suggestion.id}`}*/}
                            {/*                      className="text-decoration-none text-dark">*/}
                            {/*                    {suggestion.title}*/}
                            {/*                </Link>*/}
                            {/*            </li>*/}
                            {/*        ))}*/}
                            {/*    </ul>*/}
                            {/*)}*/}
                        </div>
                    </Col>
                    <Col>
                        <Form.Group controlId="searchByCategory">
                            <Form.Control
                                as="select"
                                value={searchCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((category) => (
                                    <option value={category.id} key={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>{articles.map((article) => renderArticle(article, 'regular'))}</Row>
                <Row className="mt-4">
                    <Col className="center-pagination">
                        <Pagination>
                            <Pagination.Prev disabled={page === 1} onClick={prevPage}/>
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} disabled={page === pagesCount}/>
                        </Pagination>
                    </Col>
                </Row>

                {recommendedArticles.length > 0 && (
                    <div className="p-10 rounded-lg">
                        <Row className="mb-2">
                            <Col>
                                <h2 className="font-sans">RECOMMANDATIONS</h2>
                            </Col>
                        </Row>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                        >
                            <Row>
                                {recommendedArticles.map((article) => renderArticle(article, 'recommended'))}
                            </Row>
                        </motion.div>
                    </div>
                )}

                {popularArticles.length > 0 && (
                    <div className="p-10 rounded-lg">
                        <Row className="mb-3">
                            <Col>
                                <h2 className="font-sans">LES PLUS POPULAIRES</h2>
                            </Col>
                        </Row>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                        >
                            <Row>
                                {popularArticles.map((article) => renderArticle(article, 'popular'))}
                            </Row>
                        </motion.div>
                    </div>
                )}
            </Container>
        </motion.div>
    );
}

export default ArticleList;
