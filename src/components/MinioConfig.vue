<template>
    <div class="minio">
        <el-button type="primary" round @click="showAddDialog">新增</el-button>
        <el-button type="primary" round>刷新配置</el-button>
        <el-button type="primary" round @click="verified">验证连接</el-button>
        <el-button type="primary" round @click="openChangePwdDialog">修改密码</el-button>
        <RouterLink replace to="/uploadfile" active-class="active">上传文件</RouterLink>
        <RouterLink to="/uploadfile">上传文件</RouterLink>
        <el-table :data="tableData" v-model="selectedRows" @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" fixed label="ID" width="60" />
            <el-table-column prop="name" label="名称" width="100" />
            <el-table-column prop="accessKey" label="账号" width="120" />
            <el-table-column prop="endpoint" label="连接地址" width="250" />
            <el-table-column prop="defaultBucket" label="默认桶" width="90" />
            <el-table-column prop="expire" label="过期时间(秒)" width="110" />
            <el-table-column prop="isChoose" label="是否选择" width="90">
                <template #default="scope">
                    <span>{{ scope.row.isChoose === 1 ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" />
            <el-table-column prop="updateTime" label="更新时间" width="170" />
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button link type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button></br>
                    <el-button link type="primary" size="small" @click="switchConfig(scope.row)">切换配置</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹框 -->
        <el-dialog title="新增配置" v-model="dialogVisible" :show-close="false"  width="500" >
            <el-form :model="formData" ref="formRef" label-width="120px">
                <el-form-item label="名称" prop="name" required>
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-form-item label="账号" prop="accessKey" required>
                    <el-input v-model="formData.accessKey" />
                </el-form-item>
                <el-form-item v-if="!isEditing" label="密码" prop="secretKey" required>
                    <el-input type="password" v-model="formData.secretKey" />
                </el-form-item>
                <el-form-item label="连接地址" prop="endpoint" required>
                    <el-input v-model="formData.endpoint" />
                </el-form-item>
                <el-form-item label="默认桶" prop="defaultBucket">
                    <el-input v-model="formData.defaultBucket" />
                </el-form-item>
                <el-form-item label="过期时间(秒)" prop="expire">
                    <el-input v-model="formData.expire" />
                </el-form-item>
                <el-form-item label="是否选择">
                    <el-select v-model="formData.isChoose">
                        <el-option label="是" :value="1" />
                        <el-option label="否" :value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </template>
        </el-dialog>

         <!-- 修改密码弹框 -->
         <el-dialog title="修改密码" v-model="changePwdDialogVisible" :show-close="false" width="400">
            <el-form :model="changePwdData" ref="changePwdForm" label-width="120px">
                <el-form-item label="新密码" prop="newPassword" required>
                    <el-input type="password" v-model="changePwdData.newPassword" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword" required>
                    <el-input type="password" v-model="changePwdData.confirmPassword" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="changePwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangePwd">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onBeforeMount } from 'vue';
    import {RouterView,RouterLink} from 'vue-router'
    import axios from 'axios';
    import { ElMessage } from 'element-plus'; // 导入 ElMessage

    const tableData = reactive<any[]>([]);
    const selectedRows = ref<any[]>([]); // 绑定选中的行
    const dialogVisible = ref(false); // 弹框是否显示
    const isEditing = ref(false); // 用于判断是新增还是修改
    const changePwdDialogVisible = ref(false); // 修改密码弹框
    const formData = reactive({
        id: null, // 增加id字段用于修改
        name: '',
        accessKey: '',
        secretKey:'',
        endpoint: '',
        defaultBucket: '',
        expire: '',
        isChoose: 1,
    });

    const changePwdData = reactive({
        newPassword: '',
        confirmPassword: '',
    });

    onBeforeMount(() => {
        console.log("挂载前加载页面数据...");
        getMinioConfigList();
    });

    async function getMinioConfigList() {
        let { data } = await axios.get('http://127.0.0.1:8080/minio/list');
        tableData.splice(0, tableData.length, ...data.data);
    }

    // 删除操作
    const handleDelete = async (row: any) => {
        try {
            // 发送删除请求
            await axios.delete(`http://127.0.0.1:8080/minio/${row.id}`);
            // 从 tableData 中移除该行
            const index = tableData.indexOf(row);
            if (index > -1) {
                tableData.splice(index, 1);
            }
            ElMessage.success('删除成功'); // 删除成功提示
        } catch (error) {
            ElMessage.error('删除失败'); // 删除失败提示
        }
    };

    const showAddDialog = () => {
        isEditing.value = false; // 标记为新增
        dialogVisible.value = true;
        // 重置表单数据
        Object.assign(formData, {
            id: null, // 重置id
            name: '',
            accessKey: '',
            secretKey:'',
            endpoint: '',
            defaultBucket: '',
            expire: '',
            isChoose: 1,
        });
    };

    // 切换配置
    const switchConfig = async (row: any) => {
        try {
            // 发送请求
            const response = await axios.get(`http://127.0.0.1:8080/minio/switch/${row.id}`);
            if (response.data.code===200) {
                ElMessage.success('切换成功');
                await getMinioConfigList();
            } else {
                ElMessage.error('切换失败：'+response.data.msg);
            }
            
        } catch (error: unknown) {  // 指定 error 的类型为 unknown
            // 使用类型断言将 unknown 转换为 Error
            if (axios.isAxiosError(error)) {
                ElMessage.error('请求失败: ' + (error.response?.data?.message || error.message)); // 使用 error.response 获取后端返回的错误信息
            } else {
                ElMessage.error('请求失败: ' + error); // 如果不是 Axios 错误，直接输出
            }
     }
    };

    // 新增配置信息
    const submitForm = async () => {
        try {
            console.log('提交的数据:', formData);
            if (isEditing.value) {
                // 修改操作
                const response = await axios.post(`http://127.0.0.1:8080/minio/edit`, formData);
                console.log('修改相应数据 :>> ', response);
                if (response.data.code === 200) {
                    ElMessage.success('修改成功');
                } else {
                    ElMessage.error('修改失败：' + response.data.msg);
                }
            }else{
                // 新增操作
                const response = await axios.post('http://127.0.0.1:8080/minio/', formData);
                console.log('object相应数据 :>> ', response);
                if (response.data.code===200) {
                    ElMessage.success('新增成功');
                } else {
                    ElMessage.error('新增失败：'+response.data.msg);
                }
            }
            // 刷新数据
            await getMinioConfigList();
            // 关闭弹窗
            dialogVisible.value = false;
        }catch (error: unknown) {  // 指定 error 的类型为 unknown
            // 使用类型断言将 unknown 转换为 Error
            if (axios.isAxiosError(error)) {
                ElMessage.error('请求失败: ' + (error.response?.data?.message || error.message)); // 使用 error.response 获取后端返回的错误信息
            } else {
                ElMessage.error('请求失败: ' + error); // 如果不是 Axios 错误，直接输出
            }
        }
    };
    const handleUpdate = (row: any) => {
        isEditing.value = true; // 标记为编辑
        dialogVisible.value = true;
        // 填充表单数据
        Object.assign(formData, {
            id: row.id, // 获取ID以便后续更新
            name: row.name,
            accessKey: row.accessKey,
            secretKey: row.secretKey,
            endpoint: row.endpoint,
            defaultBucket: row.defaultBucket,
            expire: row.expire,
            isChoose: row.isChoose,
        });
    };

    // 验证是否可以连接
    const verified = async () => {
        try {
            // 发送请求
            const response = await axios.get(`http://127.0.0.1:8080/minio/verified`);
            if (response.data.code===200) {
                ElMessage.success('连接成功');
                await getMinioConfigList();
            } else {
                ElMessage.error('连接失败：' + response.data.msg);
            }
        } catch (error: unknown) {  // 指定 error 的类型为 unknown
            // 使用类型断言将 unknown 转换为 Error
            if (axios.isAxiosError(error)) {
                ElMessage.error('请求失败: ' + (error.response?.data?.message || error.message)); // 使用 error.response 获取后端返回的错误信息
            } else {
                ElMessage.error('请求失败: ' + error); // 如果不是 Axios 错误，直接输出
            }
     }
    };

    
    // 处理选中行变化
    const handleSelectionChange = (rows:any) => {
        selectedRows.value = rows;
        console.log('当前选中行:', selectedRows.value); // 调试信息
    };

    // 打开修改密码对话框
    const openChangePwdDialog = () => {
        if (selectedRows.value.length !== 1) {
            ElMessage.warning('请选择一条要修改密码的配置信息');
            return;
        }
        
        // 获取选中的行
        const selectedRow = selectedRows.value[0];
        formData.id = selectedRow.id; // 将 id 传递到 formData（如果需要）

        changePwdDialogVisible.value = true;
        changePwdData.newPassword = '';
        changePwdData.confirmPassword = '';
    };

    // 提交修改密码
    const submitChangePwd = async () => {
        if (changePwdData.newPassword !== changePwdData.confirmPassword) {
            ElMessage.error('两次密码输入不一致');
            return;
        }
        try {
            const response = await axios.post(`http://127.0.0.1:8080/minio/changePwd`, {
                id: formData.id, // 使用传递的 id
                secretKey: changePwdData.newPassword,
            });
            if (response.data.code === 200) {
                ElMessage.success('密码修改成功');
            } else {
                ElMessage.error('密码修改失败：' + response.data.msg);
            }
            changePwdDialogVisible.value = false; // 关闭弹窗
        } catch (error) {
            ElMessage.error('请求失败');
        }
    };
</script>

<style scoped>
.minio {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 5px;
}
</style>
