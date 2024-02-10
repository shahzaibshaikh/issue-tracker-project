"use client";

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "../../components/Skeleton";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3
  });

  if (isLoading) return <Skeleton />;
  if (error) return null;

  return (
    <Select.Root
      defaultValue={issue.assignedToUserId || "null"}
      onValueChange={userId => {
        axios.patch("/api/issues/" + issue.id, {
          assignedToUserId: userId !== "null" ? userId : null
        });
      }}
    >
      <Select.Trigger placeholder='Assign...' />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value='null'>Unassigned</Select.Item>
          {users?.map(user => (
            <Select.Item value={user.id} key={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;