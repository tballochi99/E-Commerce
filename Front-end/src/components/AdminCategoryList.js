import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Alert, Button, Card, Form, Modal, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faPlus, faTrash,} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "./AppContext";


function AdminCategoryList() {
    const {isAdmin} = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const token = localStorage.getItem('jwtToken');

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            setError("Erreur lors du chargement des catégories.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDelete = (category) => {
        openDeleteModal(category);
    };

    const handleEdit = (category) => {
        if (category && editingCategory === category) {
            setEditingCategory(null);
            setNewCategoryName("");
        } else if (category) {
            setEditingCategory(category);
            setNewCategoryName(category.name);
        } else {
            setEditingCategory(null);
            setNewCategoryName("");
        }
    };
    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/category/${categoryToDelete.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchCategories();
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            } catch (error) {
                setError("Erreur lors de la suppression de la catégorie.");
                console.error(error);
            }
        }
    };


    const handleSave = async () => {
        try {
            if (editingCategory) {
                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/category/${editingCategory.id}`,
                    {
                        name: newCategoryName,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/category`, {
                    name: newCategoryName,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setNewCategoryName("");
            fetchCategories();
        } catch (error) {
            setError("Erreur lors de l'enregistrement de la catégorie.");
            console.error(error);
        }
    };

    if (!isAdmin) {
        return <div>Vous n'avez pas l'autorisation d'accéder à cette page.</div>;
    }

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
        <div className="d-flex flex-wrap flex m-auto justify-center bg-gray-100 mt-5">
            {error && <Alert variant="danger">{error}</Alert>}
            {categories.map((category) => (
                <Card style={{width: "18rem"}} className="m-3" key={category.id}>
                    <Card.Body>
                        {editingCategory === category ? (
                            <Form.Control
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                        ) : (
                            <Card.Title>{category.name}</Card.Title>
                        )}
                        <div className="flex">
                            {editingCategory === category ? (
                                <>
                                    <Button
                                        variant="success"
                                        onClick={handleSave}
                                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleEdit(null)}
                                        className="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(category)}
                                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </Button>
                                    <Button
                                        variant="info"
                                        onClick={() => handleEdit(category)}
                                        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            ))}
            <Card style={{width: "18rem"}} className="m-3">
                <Card.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nouvelle categorie"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mt-2"
                    >
                        <FontAwesomeIcon icon={faPlus}/> Ajouter categorie
                    </Button>
                </Card.Body>
            </Card>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela supprimera également toutes les
                    sous-catégories et articles liés.
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default AdminCategoryList;
