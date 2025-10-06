import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { MouseEvent, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Page from "./Page";
import Button from "@mui/material/Button";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { PersonListType } from "../components/PersonList/types";
import PersonDeleteButton from "../components/PersonDeleteButton";
import { usePersonList } from "../components/PersonList/hooks";

const LIST_PEOPLE = gql`
  query ListPeople($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
      }
      user {
        id
      }
    } 
  }
`;
const LIST_EMPLOYEES = gql`
  query ListEmployees($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
        department {
          name
        }
        title
      }
      user {
        id
      }
    } 
  }
`;
const LIST_USERS = gql`
  query ListUsers($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
      }
      user {
        id
        userType
      }
    } 
  }
`;

const getPersonListQuery = (type: PersonListType) => {
  switch (type) {
    case "Employees":
      return LIST_EMPLOYEES;
    case "Users":
      return LIST_USERS;
    default:
      return LIST_PEOPLE;
  }
}

const getPersonListWhereQuery = (type: PersonListType): any => {
  switch (type) {
    case "Employees":
      return { employee: { isNot: null } };
    case "Users":
      return { user: { isNot: null } };
    default:
      return {};
  }
};


const defaultOrderBy = "name";

const PersonList = ({
  type = "All People",
}: {
  type?: PersonListType
}) => {
  const {
    columns,
    filters,
    groupByOptions,
    debouncedFilterValues,
    onChangeFilter,
    resetFilters
  } = usePersonList(type);
  const [searchParams, setSearchParams] = useSearchParams();
  const whereArgs = getPersonListWhereQuery(type);
  if (searchParams.get('name')) {
    whereArgs.OR = [
      {
        firstName: {
          contains: searchParams.get('name'),
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: searchParams.get('name'),
          mode: "insensitive",
        }
      }
    ];
  }
  if (searchParams.get('email')) {
    whereArgs.email = {
      contains: searchParams.get('email'),
      mode: "insensitive",
    };
  }
  if (searchParams.get('title')) {
    whereArgs.employee = {
      is: {
        title: {
          contains: searchParams.get('title'),
          mode: "insensitive",
        }
      }
    };
  }
  const orderByArgs: any[] = [];
  switch (searchParams.get('groupBy')) {
    case "department":
      orderByArgs.push({ employee: { department: { name: "asc" } } });
      break;
    case "userType":
      orderByArgs.push({ user: { userType: "asc" } });
      break;
  }
  const sortOrder = searchParams.get('sortOrder') || "asc";
  const orderBy = searchParams.get('orderBy') || defaultOrderBy;
  switch (searchParams.get('orderBy') || defaultOrderBy) {
    case "email":
      orderByArgs.push({ email: { sort: sortOrder, nulls: "last" } });
      break;
    case "title":
      orderByArgs.push({ employee: { title: sortOrder } });
      break;
  }
  // Always add name sorting last
  orderByArgs.push({ firstName: sortOrder });
  orderByArgs.push({ lastName: sortOrder });
  const { data, refetch } = useQuery(getPersonListQuery(type), { variables: { whereArgs, orderByArgs } });


  const changeFilter = useCallback((key: string, value: string) => {
    if (value) {
      setSearchParams({ ...Object.fromEntries(searchParams), [key]: value });
    } else {
      searchParams.delete(key);
      setSearchParams(searchParams);
    }
  }, [searchParams, type]);

  const onClickClearFilters = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    resetFilters();
  }, []);

  const onChangeGroupBy = useCallback((ev: SelectChangeEvent) => {
    changeFilter('groupBy', ev.target.value);
  }, [changeFilter]);

  const onClickHeader = useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    const targetOrderBy = ev.currentTarget.dataset.field || defaultOrderBy;
    const currentOrderBy = searchParams.get("orderBy") || defaultOrderBy;
    const currentSortOrder = searchParams.get("sortOrder") || "asc";
    const targetSortOrder = targetOrderBy == currentOrderBy && currentSortOrder == "asc" ? "desc" : "asc";

    setSearchParams({ ...Object.fromEntries(searchParams), orderBy: targetOrderBy, sortOrder: targetSortOrder });
  }, [changeFilter, searchParams]);

  const navigate = useNavigate();
  const onClickRow = useCallback((ev: MouseEvent) => {
    // @ts-ignore
    navigate(`/people/${ev.currentTarget.dataset.id}`);
  }, []);

  return (
    <Page>
      <h1>{type}</h1>
      <Box className="table-filters" sx={{ mb: 4 }}>
        <Stack spacing={2} direction="row">
          {filters.map((filter) => (
            <TextField
              key={filter.key}
              value={filter.debounced ? debouncedFilterValues[filter.key] : searchParams.get(filter.key)}
              label={filter.label}
              data-name={filter.key}
              onChange={onChangeFilter}
              slotProps={{
                htmlInput: {
                  "data-filter": filter.key
                }
              }}
              size="small"
            />
          ))}
          {Object.keys(groupByOptions).length > 0 && (
            <FormControl style={{ minWidth: "120px" }}>
              {/* TODO: Fix the label offset. Not sure why but it is off-center */}
              <InputLabel id="group-by-select">Group By</InputLabel>
              <Select labelId="group-by-select" label="Group By" value={searchParams.get("groupBy") || ""} onChange={onChangeGroupBy} size="small" autoWidth>
                <MenuItem value="">None</MenuItem>
                {Object.entries(groupByOptions).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button onClick={onClickClearFilters} variant="contained" size="small" disabled={searchParams.size == 0}>Clear Filters</Button>
        </Stack>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.key}>
                  {column.sortable ? (
                    <a href="#" data-field={column.key} onClick={onClickHeader}>
                      {column.label}
                    </a>
                  ) : column.label}
                  {orderBy == column.key && (sortOrder == "asc" ? (
                    <ArrowDownIcon fontSize="small" />
                  ) : (
                    <ArrowUpIcon fontSize="small" />
                  ))}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* @ts-ignore */}
            {(data?.listPeople || []).map((person) => (
              <TableRow hover key={person.id} onClick={onClickRow} data-id={person.id} style={{ cursor: "pointer" }}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="table-cell">{column.cellFn(person)}</TableCell>
                ))}
                <PersonDeleteButton person={person} onDelete={refetch} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default PersonList;
