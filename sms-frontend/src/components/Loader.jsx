import '../css/loader.css';

function Loader() {
    return (
        <div className="loader-page">
            <div className="loader-card">

                <div className="spinner"></div>

                <h2>Student Management System</h2>

                <p>
                    Loading Data, please wait...
                </p>

            </div>
        </div>
    );
}

export default Loader;