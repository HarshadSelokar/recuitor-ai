
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // This page is no longer needed as we're using the Dashboard component as the index route
  // So we'll just redirect to the root, which will render the Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
