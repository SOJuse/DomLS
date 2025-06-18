import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Dashboard,
  Logout,
  Visibility,
  Refresh,
  ContactMail
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CalculatorRequest {
  id: number;
  repair_type: string;
  area: number;
  extras: Record<string, boolean>;
  calculated_price: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  created_at: string;
}

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  created_at: string;
}

interface CombinedAnalytics {
  total_requests: number;
  calculator_requests: number;
  contact_requests: number;
  active_days: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  total_value: number;
  avg_area: number;
  requests_last_7_days: number;
  requests_last_30_days: number;
  calculator_requests_last_7_days: number;
  contact_requests_last_7_days: number;
  calculator_requests_last_30_days: number;
  contact_requests_last_30_days: number;
}

interface DailyStats {
  date: string;
  count: number;
  total_value: number;
  calculator_count: number;
  contact_count: number;
}

const API_BASE = '/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<CalculatorRequest[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [analytics, setAnalytics] = useState<CombinedAnalytics | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CalculatorRequest | null>(null);
  const [selectedContactRequest, setSelectedContactRequest] = useState<ContactRequest | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showContactRequestDialog, setShowContactRequestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
    setIsLoading(false);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [requestsRes, contactRequestsRes, analyticsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/requests`, { headers }),
        fetch(`${API_BASE}/admin/contact-requests`, { headers }),
        fetch(`${API_BASE}/admin/analytics/combined`, { headers }),
        fetch(`${API_BASE}/admin/stats/daily/combined`, { headers })
      ]);

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.data);
      }

      if (contactRequestsRes.ok) {
        const contactRequestsData = await contactRequestsRes.json();
        setContactRequests(contactRequestsData.data);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data.analytics);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDailyStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setRequests([]);
    setContactRequests([]);
    setAnalytics(null);
    setDailyStats([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const getRepairTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'черновой': 'default',
      'косметический': 'primary',
      'капитальный': 'secondary',
      'дизайнерский': 'success'
    };
    return colors[type] || 'default';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            DomLS Admin
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Вход в панель управления
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              margin="normal"
              required
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Войти
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }} color="textSecondary">
            Логин: admin | Пароль: admin123
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DomLS Admin - Панель управления
          </Typography>
          <IconButton color="inherit" onClick={fetchData}>
            <Refresh />
          </IconButton>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Аналитика */}
        {analytics && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Всего заявок
                  </Typography>
                  <Typography variant="h4">
                    {analytics.total_requests}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Калькулятор: {analytics.calculator_requests} | Контакты: {analytics.contact_requests}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Средняя стоимость
                  </Typography>
                  <Typography variant="h4">
                    {formatPrice(Math.round(analytics.avg_price))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Только заявки калькулятора
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Заявок за 7 дней
                  </Typography>
                  <Typography variant="h4">
                    {analytics.requests_last_7_days}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Калькулятор: {analytics.calculator_requests_last_7_days} | Контакты: {analytics.contact_requests_last_7_days}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Общая стоимость
                  </Typography>
                  <Typography variant="h4">
                    {formatPrice(Math.round(analytics.total_value))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Только заявки калькулятора
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Графики */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Заявки по дням (всего)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Всего" />
                    <Line type="monotone" dataKey="calculator_count" stroke="#82ca9d" name="Калькулятор" />
                    <Line type="monotone" dataKey="contact_count" stroke="#ffc658" name="Контакты" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Стоимость по дням
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Табы для заявок */}
        <Card>
          <CardContent>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab 
                icon={<Dashboard />} 
                label={`Заявки калькулятора (${requests.length})`} 
                iconPosition="start"
              />
              <Tab 
                icon={<ContactMail />} 
                label={`Контактные заявки (${contactRequests.length})`} 
                iconPosition="start"
              />
            </Tabs>

            {/* Заявки калькулятора */}
            {activeTab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Тип ремонта</TableCell>
                      <TableCell>Площадь</TableCell>
                      <TableCell>Стоимость</TableCell>
                      <TableCell>Клиент</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.repair_type} 
                            color={getRepairTypeColor(request.repair_type) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.area} м²</TableCell>
                        <TableCell>{formatPrice(request.calculated_price)}</TableCell>
                        <TableCell>
                          {request.customer_name ? (
                            <div>
                              <div>{request.customer_name}</div>
                              {request.customer_phone && (
                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                  {request.customer_phone}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#999' }}>Не указан</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRequestDialog(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Контактные заявки */}
            {activeTab === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Телефон</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Сообщение</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contactRequests.map((contactRequest) => (
                      <TableRow key={contactRequest.id}>
                        <TableCell>{contactRequest.id}</TableCell>
                        <TableCell>{contactRequest.name}</TableCell>
                        <TableCell>{contactRequest.phone}</TableCell>
                        <TableCell>{contactRequest.email || '-'}</TableCell>
                        <TableCell>
                          {contactRequest.message ? (
                            <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {contactRequest.message}
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{formatDate(contactRequest.created_at)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedContactRequest(contactRequest);
                              setShowContactRequestDialog(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Диалог деталей заявки калькулятора */}
      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Детали заявки #{selectedRequest?.id}</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Тип ремонта:</Typography>
                <Typography>{selectedRequest.repair_type}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Площадь:</Typography>
                <Typography>{selectedRequest.area} м²</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Стоимость:</Typography>
                <Typography>{formatPrice(selectedRequest.calculated_price)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Дата создания:</Typography>
                <Typography>{formatDate(selectedRequest.created_at)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Дополнительные услуги:</Typography>
                <Box sx={{ mt: 1 }}>
                  {Object.entries(selectedRequest.extras).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={key}
                      color={value ? 'success' : 'default'}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
              {selectedRequest.customer_name && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Контактная информация:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Имя:</Typography>
                    <Typography>{selectedRequest.customer_name}</Typography>
                  </Grid>
                  {selectedRequest.customer_phone && (
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Телефон:</Typography>
                      <Typography>{selectedRequest.customer_phone}</Typography>
                    </Grid>
                  )}
                  {selectedRequest.customer_email && (
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Email:</Typography>
                      <Typography>{selectedRequest.customer_email}</Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог деталей контактной заявки */}
      <Dialog open={showContactRequestDialog} onClose={() => setShowContactRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Детали контактной заявки #{selectedContactRequest?.id}</DialogTitle>
        <DialogContent>
          {selectedContactRequest && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Имя:</Typography>
                <Typography>{selectedContactRequest.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Телефон:</Typography>
                <Typography>{selectedContactRequest.phone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography>{selectedContactRequest.email || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Дата создания:</Typography>
                <Typography>{formatDate(selectedContactRequest.created_at)}</Typography>
              </Grid>
              {selectedContactRequest.message && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Сообщение:</Typography>
                  <Typography sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {selectedContactRequest.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowContactRequestDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App; 