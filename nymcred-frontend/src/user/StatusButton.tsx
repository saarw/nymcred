import { Link } from "react-router-dom";

/**
 * Shows the signed-in user or a link to sign in.
 */
export function StatusButton(props: {
  userName?: string
}) {
  return props.userName != null ? <div>{props.userName}</div> : <Link to="login">Sign in/Register</Link>;
}