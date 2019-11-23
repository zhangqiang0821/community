/**
 * 上传相关接口
 */

import apiHelper from './apiHelper';
import userHelper from '../utils/userHelper';

class UploadService {
    /**
     * 上传图片 
     * 'https://pic.cx580.com:2443/api/upload' //生产环境
     * 'http://192.168.1.50:9016/api/upload' //测试环境
     * @param data Object
     * {
     * imgData://必填，图片的 base64 格式字符串
     * bizType://必填，业务类别 社区为community
     * format://必填，图片格式（如jpg/png）
     * channel://必填，上传渠道
     * tags://图标标签
     * exId://外部ID（如订单号）
     * }
     */
    uploadImg(data) {
        data.bizType = 'community';
        let url = apiHelper.production ? 'https://pic.cx580.com:2443/api/upload' : 'http://192.168.1.50:9016/api/upload';
        let requestParam = {
            url: url,
            data: {
                method: 'post',
                body: data
            }
        };
        return apiHelper.fetch(requestParam);
    }

}
// 实例化后再导出
export default new UploadService()