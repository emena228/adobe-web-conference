import { useEffect, useState } from "react";
import Head from "next/head";
import DataTable from "@components/admin/dashboard/atoms/data-table";
import Search from "@components/admin/dashboard/atoms/search";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "@components/layout";
import Protected from "@components/admin/protected";
import { signIn, signOut, useSession } from "next-auth/client";
import { get } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: "150px",
  },
  container: {
    marginTop: "80px",
  },
}));

export default function UsersList() {
  const classes = useStyles();
  const [users, setUsers] = useState();
  const [searchOpen, setSearchOpen] = useState();
  const [session, loading] = useSession();

  async function fetchData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/users/list`
    );
    const { users } = await res.json();
    setUsers(users);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
  ];

  return (
    <div>
      <Head>
        <title>Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="none" className={classes.container}>
          <Protected>
            <DataTable
              title="Users"
              url="/manage/users"
              rows={users}
              headCells={headCells}
              searchFunc={setSearchOpen}
            />
            <Search open={searchOpen} closeFunc={setSearchOpen} />
          </Protected>
        </Container>
      </Layout>
    </div>
  );
}
