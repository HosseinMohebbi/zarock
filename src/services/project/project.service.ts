import { http } from "@/utils/api/http";
import { AddProjectPayload, AddProjectResponse } from "./project.types";
import {endpoints} from "@/config/endpoint.config";

// ------------------------------------
// CREATE
// ------------------------------------
export async function createProject(
    businessId: string,
    payload: AddProjectPayload
): Promise<AddProjectResponse> {
    const { data } = await http.post<AddProjectResponse>(
        endpoints.project.create(businessId),
        payload
    );
    return data;
}

// ------------------------------------
// GET ALL (with pagination)
// GET → /api/Project/{businessId}/all?page=1&pageSize=10
// ------------------------------------
export async function getAllProjects(
    params: { page: number; pageSize: number },
    businessId: string
): Promise<AddProjectResponse[]> {
    const { page, pageSize } = params;

    const { data } = await http.get<AddProjectResponse[]>(
        endpoints.project.getAll(businessId),
        {
            params: { page, pageSize },
        }
    );

    return data;
}

// ------------------------------------
// FILTER
// POST → /api/Project/{businessId}/filter?page=1&pageSize=10
// body: { pattern, tags }
// ------------------------------------
export async function filterProjects(
    businessId: string,
    params: {
        page: number;
        pageSize: number;
        pattern: string;  // search text
        tags?: string[];
    }
): Promise<AddProjectResponse[]> {
    const { page, pageSize, pattern, tags } = params;

    const { data } = await http.post<AddProjectResponse[]>(
        `/api/Project/${businessId}/filter`,
        {
            pattern,
            tags,
        },
        {
            params: { page, pageSize },
        }
    );

    return data;
}

// ------------------------------------
// UPDATE
// PUT → /api/Project/{businessId}/{projectId}
// ------------------------------------
export async function updateProject(
    businessId: string,
    projectId: string,
    payload: AddProjectPayload
): Promise<ProjectResponse> {
    const { data } = await http.put<ProjectResponse>(
        `/api/Project/${businessId}/${projectId}`,
        payload
    );

    return data;
}

// ------------------------------------
// DELETE
// DELETE → /api/Project/{businessId}/{projectId}
// ------------------------------------
export async function deleteProject(
    businessId: string,
    projectId: string
): Promise<void> {
    await http.delete(`/api/Project/${businessId}/${projectId}`);
}