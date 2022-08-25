import React from 'react';

export function ErrorAlert(props: {
  message?: string,
  dismissed: () => void
}) {
  if (props.message != null) {
    return <div className="alert alert-danger d-flex flex-row align-items-center"><div>{props.message}</div>
        <button type="button" className="btn-close btn-sm ms-2" onClick={props.dismissed}></button></div>;
  }
  return <></>;
}