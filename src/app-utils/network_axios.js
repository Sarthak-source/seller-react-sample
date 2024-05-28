import axios from 'axios';
import { ApiAppConstants } from './api-constants';


const NetworkAxiosOptions = {
    endPointUrl: ApiAppConstants.apiEndPoint,
    cacheOptions: null,
    axiosOptions: axios.create(JSON.parse(localStorage.getItem('cacheOptions'))),

    async getHeaders() {
        const token = localStorage.getItem('token');
        console.log(`Token :- ${token}`);
        if (token !== null) {
            console.log(`~~~~~~~~~~~~~~~~~~~~ SET HEADER : ${token} ~~~~~~~~~~~~~~~~~~~`);
            return {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'authorization': token,
            };
        }
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        };

    },

    async setDynamicHeader() {
        const options = {
            receiveTimeout: 15000,
            connectTimeout: 15000,
        };

        const token = await this.getHeaders();
        options.headers = token;
        console.log('options', options)
        const optionJson = JSON.stringify(options);

        localStorage.setItem('cacheOptions', optionJson)
        this.axiosOptions = axios.create(options);

        console.log('axiosOptions', this.axiosOptions)

        if (!this.axiosOptions.interceptors) {
            console.error("Interceptors are not defined");
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            this.axiosOptions.interceptors.request.use((request) => {
                console.log('Starting Request', request);
                return request;
            });

            this.axiosOptions.interceptors.response.use((response) => {
                console.log('Response:', response);
                return response;
            });
        }
    },

    async getAxiosHttpMethod({ url, header, full = true }) {
        console.log('ddfdfdfdfdf', url);
        const fullUrl = full ? `${this.endPointUrl}${url}` : url;
        try {
            const response = await this.axiosOptions.get(fullUrl, { headers: header || this.cacheOptions });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    async putAxiosHttpMethod({ url, data, header, ContentType = 'application/x-www-form-urlencoded' }) {
        try {
            const response = await this.axiosOptions.put(
                `${this.endPointUrl}${url}`,
                data,
                {
                    headers: {
                        ...header,
                        'Content-Type': ContentType,
                    } || this.cacheOptions,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    async patchAxiosHttpMethod({ url, data, header, ContentType = 'application/x-www-form-urlencoded' }) {
        try {
            const response = await this.axiosOptions.patch(
                `${this.endPointUrl}${url}`,
                data,
                {
                    headers: {
                        ...header,
                        'Content-Type': ContentType,
                    } || this.cacheOptions,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    async postAxiosHttpMethod({ url, data, header, ContentType = 'application/x-www-form-urlencoded' }) {
        try {
            console.log('postAxiosHttpMethod', `${this.endPointUrl}${url}`)
            const response = await this.axiosOptions.post(`${this.endPointUrl}${url}`, data, {
                headers: {
                    ...header,
                    'Content-Type': ContentType,
                } || this.cacheOptions,
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteAxiosHttpMethod({ url, data }) {
        try {
            const response = await this.axiosOptions.delete(`${this.endPointUrl}${url}`, { data, headers: this.cacheOptions });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    async multipleConcurrentAxiosHttpMethod({ getUrl, postUrl, postData }) {
        try {
            const getPromise = this.axiosOptions.get(`${this.endPointUrl}${getUrl}`, { headers: this.cacheOptions });
            const postPromise = this.axiosOptions.post(`${this.endPointUrl}${postUrl}`, postData, { headers: this.cacheOptions });

            const [getResponse, postResponse] = await Promise.all([getPromise, postPromise]);

            return {
                getBody: getResponse.data,
                postBody: postResponse.data,
                headers: getResponse.headers,
                error_description: null
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async sendingFormDataAxiosHttpMethod({ url, data }) {
        try {
            const response = await this.axiosOptions.post(`${this.endPointUrl}${url}`, data, { headers: this.cacheOptions });

            return {
                body: response.data,
                headers: response.headers,
                error_description: null
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    async _handleError(error, message) {
        let errorDescription = "";

        try {
            console.log("In side try");
            const result = await this.axiosOptions.get('https://www.google.com');
            if (result && result.data) {
                console.log("In side internet condition");
                if (error.response) {
                    switch (error.response.status) {
                        case 408:
                            errorDescription = "Connection timeout with API server";
                            console.log(errorDescription);
                            break;
                        case 504:
                            errorDescription = "Gateway Timeout";
                            console.log(errorDescription);
                            break;
                        case 500:
                            errorDescription = "Internal Server Error";
                            console.log(errorDescription);
                            break;
                        case 401:
                            errorDescription = "Unauthorized";
                            console.log(errorDescription);
                            break;
                        default:
                            errorDescription = message || "Unexpected error occurred";
                            console.log(errorDescription);
                            break;
                    }
                }
            }
        } catch (err) {
            errorDescription = "Check your internet connection";
            console.log(errorDescription);
        }

        return errorDescription;
    }

};

export default NetworkAxiosOptions;
