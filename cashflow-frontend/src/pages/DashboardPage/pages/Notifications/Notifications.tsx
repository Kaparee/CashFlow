import React, { useState, useEffect, useContext } from 'react';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';
import sDashboard from '../../DashboardPage.module.css';
import s from './Notifications.module.css';
import { format } from 'date-fns'

type NotificationStatus = 'read' | 'unread';

export interface Notification {
    notificationId: number;
    subject: string;
    body: string;
    sentAt: string;
    status: NotificationStatus;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { addToast } = useContext(ToastContext);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/notifications-info');
            setNotifications(res.data);
        } catch (error: any) {
            addToast('Nie udało się pobrać powiadomień', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await api.patch(`/set-notification-status-read`, null, { 
                params: {
                    'notificationId': notificationId
                }
            });
            setNotifications(prev =>
                prev.map(n =>
                    n.notificationId === notificationId
                        ? { ...n, status: 'read' as NotificationStatus }
                        : n
                )
            );
        } catch (error: any) {
            console.log(error)
            addToast('Nie udało się oznaczyć powiadomienia', 'error');
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            await api.delete(`/delete-notification`, { 
                params: {'notificationId': notificationId }
            });
            setNotifications(prev =>
                prev.filter(n => n.notificationId !== notificationId)
            );
            addToast('Powiadomienie usunięte', 'info');
        } catch (error: any) {
            addToast('Nie udało się usunąć powiadomienia', 'error');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => n.status === 'unread')
        : notifications;

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <div className="w-100 h-100 d-flex flex-column">
            <div className={`d-flex fs-3 px-2 py-1 ${sDashboard.textDarkPrimary} ${sDashboard.textDarkUnderline}`}>
                Powiadomienia {unreadCount > 0 && `(${unreadCount} nowych)`}
            </div>

            <div className="p-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} rounded-5`}
                            onClick={() => setFilter('all')}
                        >
                            Wszystkie ({notifications.length})
                        </button>
                        <button
                            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'} rounded-5`}
                            onClick={() => setFilter('unread')}
                        >
                            Nieprzeczytane ({unreadCount})
                        </button>
                    </div>
                </div>

                <div className="row">
                    {isLoading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Ładowanie...</span>
                            </div>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className={`col-12 text-center py-5 ${sDashboard.textDarkSecondary}`}>
                            <i className="bi bi-bell-slash fs-1 d-block mb-3 opacity-50"></i>
                            <p className="mb-0">
                                {filter === 'unread'
                                    ? 'Brak nieprzeczytanych powiadomień'
                                    : 'Brak powiadomień'}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div key={notification.notificationId} className="col-12 mb-2">
                                <div
                                    className={`${s.notificationCard} ${notification.status === 'unread' ? s.unread : ''} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} p-3 rounded-4 border`}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                {notification.status === 'unread' && (
                                                    <span className="badge bg-primary">Nowe</span>
                                                )}
                                                <h6 className={`mb-0 ${sDashboard.textDarkPrimary}`}>
                                                    {notification.subject}
                                                </h6>
                                            </div>
                                            <p className={`mb-2 ${sDashboard.textDarkSecondary}`}>
                                                {notification.body}
                                            </p>
                                            <small className={`${sDashboard.textDarkSecondary} opacity-75`}>
                                                <i className="bi bi-clock me-1"></i>
                                                {format(notification.sentAt, 'yyyy-mm-dd HH:mm:ss')}
                                            </small>
                                        </div>

                                        <div className="d-flex gap-1 ms-3">
                                            {notification.status === 'unread' && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary rounded-3"
                                                    onClick={() => markAsRead(notification.notificationId)}
                                                    title="Oznacz jako przeczytane"
                                                >
                                                    <i className="bi bi-check"></i>
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-3"
                                                onClick={() => deleteNotification(notification.notificationId)}
                                                title="Usuń"
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;