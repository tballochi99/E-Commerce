import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';


function PaymentPopup({show, onHide, onGuestCheckout}) {
    const navigate = useNavigate();
    const [showEmailField, setShowEmailField] = useState(false);
    const [email, setEmail] = useState("");
    const handleGuestCheckout = () => {
        onGuestCheckout(email);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Finaliser la commande</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Vous avez déjà un compte ?</p>
                <Button variant="primary" className="mb-3 w-100" onClick={() => navigate('/login')}>
                    Se connecter
                </Button>
                <p>Ou continuez en tant qu'invité</p>
                <Button variant="secondary" className="w-100" onClick={onGuestCheckout}>
                    Continuer sans compte
                </Button>
                {/*{showEmailField && (*/}
                {/*    <Form className="mt-3">*/}
                {/*        <Form.Group controlId="formBasicEmail" className="mb-3">*/}
                {/*            <Form.Label>Adresse email</Form.Label>*/}
                {/*            <Form.Control*/}
                {/*                type="email"*/}
                {/*                placeholder="Entrez votre email"*/}
                {/*                value={email}*/}
                {/*                onChange={(e) => setEmail(e.target.value)}*/}
                {/*                className="mb-3"*/}
                {/*            />*/}
                {/*        </Form.Group>*/}
                {/*        <Button variant="success" className="w-100" onClick={handleGuestCheckout}>*/}
                {/*            Poursuivre*/}
                {/*        </Button>*/}
                {/*    </Form>*/}
                {/*)}*/}
            </Modal.Body>
        </Modal>
    );
}


export default PaymentPopup;