import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const LIST_DEPARTMENTS = gql`
  query ListDepartments($whereArgs: DepartmentWhereInput, $orderByArgs: [DepartmentOrderByWithRelationInput!]) {
    listDepartments(where: $whereArgs, orderBy: $orderByArgs) {
      id
      name
      employeeCount
    } 
  }
`;

export const useListDepartments = (whereHasEmployees = false) => {
  const whereArgs: any = {};
  if (whereHasEmployees) {
    whereArgs.employees = { some: {} };
  }
  const orderByArgs: any[] = [{
    employees: {
      _count: "desc"
    },
  }];
  return useQuery(LIST_DEPARTMENTS, { variables: { whereArgs, orderByArgs } });
};
