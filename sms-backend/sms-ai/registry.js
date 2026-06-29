import { topStudentTool, lowAttendanceTool, studentReportTool, studentCGPATool, studentCountTool, gradeCriteriaTool, databaseQueryTool, generalChatTool, ragSearchTool } from './tools.js';

// ─── TOOLS REGISTRY ────────────
export const registry = {
    TOP_STUDENT: topStudentTool,
    LOW_ATTENDANCE: lowAttendanceTool,
    STUDENT_REPORT: studentReportTool,
    STUDENT_CGPA: studentCGPATool,
    STUDENT_COUNT: studentCountTool,
    GRADE_CRITERIA: gradeCriteriaTool,
    DATABASE_QUERY: databaseQueryTool,
    GENERAL_CHAT: generalChatTool,
    RAG_SEARCH: ragSearchTool
}