<template>
    <div class="login_container">
        <div class="animated bounceInDown login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="@/assets/mi_logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" prefix-icon="iconfont icon-icon_user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button class="btn" @click="login">登录</el-button>
                    <el-button class="btn" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { request } from '@/network/request';
    export default {
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: ''
                },
                // 表单验证规则对象
                loginFormRules: {
                    //验证用户名是否合法
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '用户名长度应为3-10个字符',trigger: 'blur'}
                    ],
                    // 验证密码是否合法
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '密码长度应为6-15个字符',trigger: 'blur'}
                    ]
                }
            }
        },
        mounted(){
            document.onkeydown = e => {
                // 按下的是回车键
                if(e.keyCode === 13){
                   this.login() //调用点击按钮登录的事件
                }
            }
        },
        methods: {
            // 点击重置按钮，重置登录表单
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields() // 表单自带的重置事件函数
            },
            // 点击登录按钮
            login() {
                // 拿到表单验证的结果
                this.$refs.loginFormRef.validate(async valid => {
                    // 验证不成功 跳出程序
                    if (!valid) return;
                    // 同步得到后台数据
                    const {data: res} = await request({
                        method: "post",
                        url: '/admin/login',
                        data: this.loginForm
                    })
                    if ( res.meta.code !== 200 ) return this.$message.error(res.meta.msg)
                    this.$message.success(res.meta.msg)
                    // 将登录成功之后的 token, 保存到客户端的 sessionStorage 中
                    // 项目中除了登录之外的其他API接口，必须在登录之后才能访问
                    // token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                    window.sessionStorage.setItem('token', res.data.token);
                    // 通过编程式导航调转到后台主页，路由地址是home
                    this.$router.push('/home')
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.login_container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff6700;
    .login_box {
        width: 400px;
        height: 300px;
        background-color: #fff;
        border-radius: 30px;
        box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login_form {
            position: absolute;
            bottom: 10px;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            .btns {
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                .btn {
                    outline:0;
                    color: #fff;
                    background-color: #ff6700;
                }
            }
        }
    }
}
</style>