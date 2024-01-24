// App.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px;
`;

const OrderForm = styled.div`
  width: 300px;
`;

const MainDisplay = styled.div`
  width: 600px;
`;

const PizzaCard = styled.div`
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
`;

const PizzaOrderApp = () => {
  const [orders, setOrders] = useState([]);
  const [orderFormData, setOrderFormData] = useState({
    type: 'Veg',
    size: 'Medium',
    base: 'Thin',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData({ ...orderFormData, [name]: value });
  };

  const placeOrder = () => {
    const newOrder = {
      id: orders.length + 1,
      stage: 'Order Placed',
      timeSpent: 0,
      ...orderFormData,
    };

    setOrders([...orders, newOrder]);
  };

  const moveOrderToNextStage = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, stage: getNextStage(order.stage) }
        : order
    );

    setOrders(updatedOrders);
  };

  const getNextStage = (currentStage) => {
    const stages = ['Order Placed', 'Order in Making', 'Order Ready', 'Order Picked'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : currentStage;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedOrders = orders.map((order) => ({
        ...order,
        timeSpent: order.timeSpent + 1,
      }));

      setOrders(updatedOrders);
    }, 60000);

    return () => clearInterval(timer);
  }, [orders]);

  const cancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
  };

  return (
    <Container className="mt-5">
      <OrderForm>
        <h2 className="mb-3">Place Pizza Order</h2>
        <div className="mb-3">
          <label className="form-label">Type:</label>
          <select
            className="form-select"
            name="type"
            value={orderFormData.type}
            onChange={handleInputChange}
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Size:</label>
          <select
            className="form-select"
            name="size"
            value={orderFormData.size}
            onChange={handleInputChange}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Base:</label>
          <select
            className="form-select"
            name="base"
            value={orderFormData.base}
            onChange={handleInputChange}
          >
            <option value="Thin">Thin</option>
            <option value="Thick">Thick</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={placeOrder}>
          Place Order
        </button>
      </OrderForm>

      <MainDisplay>
        <h2 className="mb-3">Orders in Progress</h2>
        {orders.map((order) => (
          <PizzaCard key={order.id} className="p-3 border">
            <p>
              Order ID: {order.id} | Stage: {order.stage} | Time Spent: {order.timeSpent} min
            </p>
            {order.stage !== 'Order Ready' && (
              <button className="btn btn-danger" onClick={() => cancelOrder(order.id)}>
                Cancel
              </button>
            )}
            <button className="btn btn-success ms-2" onClick={() => moveOrderToNextStage(order.id)}>
              Next Stage
            </button>
          </PizzaCard>
        ))}
        <Table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Stage</th>
              <th>Total Time Spent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.stage}</td>
                <td>{formatTime(order.timeSpent)}</td>
                <td>
                  {order.stage !== 'Order Ready' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MainDisplay>
    </Container>
  );
};

export default PizzaOrderApp;

const formatTime = (totalMinutes) => {
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((totalMinutes * 60) % 60);
  return `${minutes} min ${seconds} sec`;
};
