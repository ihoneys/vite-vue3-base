import axios from '../utils/reuqest'

/**
 * 获取数据
 * @param data 
 * @returns 
 */
export const getData = (data: any) => {
    const url = '/users/XPoet'
    return axios({
        url: url,
        method: 'POST',
        data
    })
}