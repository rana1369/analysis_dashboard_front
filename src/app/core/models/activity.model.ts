export interface Activity {
  id: string;
  name: string;
  description: string;
  safeValue: number;
  parentActivityId: string | null;
  parentActivity: Activity | null;
}

export interface ActivityFormData {
  name: string;
  description: string;
  safeValue: number;
  parentActivityId: string | null;
}

export interface ActivityApiResponse {
  data: Activity[];
  message: string | null;
  status: boolean;
}

