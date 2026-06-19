import "../css/gradeCriteria.css";

const GradeCriteria = () => {
    const gradingData = [
        { marks: "85 - 100", gpa: "4.0", status: "Excellent", className: "high" },
        { marks: "80 - 84", gpa: "3.7", status: "Excellent", className: "high" },
        { marks: "75 - 79", gpa: "3.3", status: "Very Good", className: "high" },
        { marks: "70 - 74", gpa: "3.0", status: "Good", className: "high" },
        { marks: "65 - 69", gpa: "2.7", status: "Average", className: "mid" },
        { marks: "60 - 64", gpa: "2.3", status: "Average", className: "mid" },
        { marks: "55 - 59", gpa: "2.0", status: "Pass", className: "mid" },
        { marks: "50 - 54", gpa: "1.7", status: "Pass", className: "mid" },
        { marks: "0 - 49", gpa: "0.0", status: "Fail", className: "low" },
    ];

    return (
        <div className="grade-container">
            <div className="grade-header">
                <i className="fa-solid fa-graduation-cap"></i>
                <h1>Grading Criteria</h1>
            </div>

            <p className="grade-description">
                The following grading scale is used to calculate GPA and CGPA.
            </p>

            <div className="table-wrapper">
                <table className="grade-table">
                    <thead>
                        <tr>
                            <th>Marks Range</th>
                            <th>GPA</th>
                            <th>Performance</th>
                        </tr>
                    </thead>

                    <tbody>
                        {gradingData.map((grade, index) => (
                            <tr key={index}>
                                <td>{grade.marks}</td>
                                <td className={grade.className}>
                                    {grade.gpa}
                                </td>
                                <td>{grade.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GradeCriteria;