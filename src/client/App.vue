<template>
    <el-main>
        <h1>Plastic Database Deployer</h1>
        <router-view></router-view>
    </el-main>
</template>

<style>
    html {
        height: 100%;
        width: 100%;
    }

    h1 {
        font-family: "DejaVu Sans Mono for Powerline", "monospace";
        color: lightskyblue;
    }

    body {
        display: flex;
        justify-content: center;
        align-content: center;
        height: 95%;
        width: 95%;
    }
</style>
