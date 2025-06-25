import styles from './ErrorPage.module.css';
import { Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const { status, statusText, data } = useRouteError();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.status}>
        {status}: {statusText}
      </h2>
      <p className={styles.message}>{data}</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}
