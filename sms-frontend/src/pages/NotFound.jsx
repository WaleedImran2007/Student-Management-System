import { useNavigate } from 'react-router-dom';
import '../css/notFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <div className="notfound-graphic">
                    <div className="notfound-number">
                        <span className="n4">4</span>
                        <span className="n0">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </span>
                        <span className="n4">4</span>
                    </div>
                </div>

                <h1 className="notfound-title">Page Not Found</h1>
                <p className="notfound-subtitle">
                    Looks like this page took the semester off. It might have been moved,
                    deleted, or it never existed in the first place.
                </p>

                <div className="notfound-actions">
                    <button className="notfound-btn-primary" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-house"></i> Go to Dashboard
                    </button>
                    <button className="notfound-btn-secondary" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i> Go Back
                    </button>
                </div>

                <div className="notfound-hint">
                    <i className="fa-solid fa-lightbulb"></i>
                    <span>Double-check the URL or use the sidebar to navigate.</span>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
