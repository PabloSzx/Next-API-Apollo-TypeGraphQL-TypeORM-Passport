import gql from "graphql-tag";
import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-apollo";

import { AuthContext, AuthenticatedUser } from "../src/client/Components/Auth/Context";
import { SignUpInput } from "../src/server";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  }, [user]);
  const [signUp, { loading }] = useMutation<
    {
      sign_up: AuthenticatedUser;
    },
    SignUpInput
  >(
    gql`
      mutation sign_up(
        $email: String!
        $name: String!
        $password: String!
        $admin: Boolean!
      ) {
        sign_up(
          email: $email
          name: $name
          password: $password
          admin: $admin
        ) {
          email
          name
          admin
        }
      }
    `,
    {
      variables: {
        email,
        password,
        name,
        admin,
      },
    }
  );

  return (
    <div>
      <Link href="/">
        <button>Home</button>
      </Link>

      <form
        onSubmit={async ev => {
          ev.preventDefault();
          try {
            const data = await signUp({
              variables: {
                email,
                password,
                name,
                admin,
              },
            });
            if (data && data.data) {
              setUser(data.data.sign_up);
            }
          } catch (err) {
            window.alert(err);
          }
        }}
      >
        <input
          name="email"
          placeholder="email"
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <input
          name="name"
          placeholder="name"
          onChange={({ target: { value } }) => setName(value)}
        />
        <label>
          <input
            type="checkbox"
            checked={admin}
            onChange={() => setAdmin(!admin)}
          />
          Admin
        </label>

        <br />

        <button type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
