import React from 'react';
import { useAuthModel } from '@/model/useAuthModel';

const TestAuthComponent: React.FC = () => {
  const { user, loading } = useAuthModel();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Auth Model Test</h3>
      <p>Loading: {loading ? 'true' : 'false'}</p>
      <p>User: {user ? JSON.stringify(user) : 'null'}</p>
      <button onClick={() => useAuthModel.getState().fetchUserInfo()}>
        Fetch User Info
      </button>
    </div>
  );
};

export default TestAuthComponent;
