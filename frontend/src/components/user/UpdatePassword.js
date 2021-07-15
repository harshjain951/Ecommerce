import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import MetaData from '../layouts/MetaData'

import { updatePassword, clearErrors } from '../../actions/authactions'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE_PASSWORD_RESET } from '../../constants/authConstants'

const UpdatePassword = ({ history }) => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success('Password updated successfully');
            history.push('/me');
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, alert, isUpdated, error, history])

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('newPassword', newPassword);
        dispatch(updatePassword(formData));
    }

    return (
        <Fragment>
            <MetaData title={'Update Password'}/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e)=>setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={newPassword}
                                onChange={(e)=>setNewPassword(e.target.value)}
                            />
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false}>
                            Set Password
                    </button>

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdatePassword
