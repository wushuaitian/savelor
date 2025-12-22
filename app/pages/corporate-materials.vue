<!-- 企业材料 -->
<template>
   <div class="material-page">
      <div class="container">
         <div class="left-column flex flex-column">
            <div class="left-top"></div>
            <div class="left-bottom"></div>
         </div>
         <div class="center-column flex flex-column"></div>
         <div class="right-column flex flex-column">
            <div class="right-top"></div>
            <div class="right-bottom"></div>
         </div>
      </div>
   </div>
</template>


<style lang="scss">
.material-page {
   min-height: 100vh;
   width: 100%;
   padding: 20px;
   font-weight: 400;

   .container {
      display: flex;
      gap: 20px;
      height: 100vh;
   }
}

.left-column {
   width: 400px;
   gap: 20px;
   border-radius: 8px;
   overflow-y: auto;
   background-color: azure;

   .left-top {
      flex: 0.7;
      border: 1px solid red;
   }

   .left-bottom {
      flex: 0.3;
      border: 1px solid yellow;

   }
}

.center-column {
   flex: 1;
   gap: 20px;
   background-color: azure;
   overflow-y: auto;
}

.right-column {
   // width: 320px;
   gap: 20px;
   overflow-y: auto;
   padding-right: 10px;
   background-color: azure;
   padding-bottom: 40px;

   .right-top {
      flex: 0.3;
      border: 1px solid red;
   }

   .right-bottom {
      flex: 0.7;
      border: 1px solid yellow;

   }
}
</style>