import { Component } from '@angular/core';

@Component({selector:'app-loader',standalone:true,template:`<div class="animate-pulse space-y-3"><div class="h-6 bg-slate-200 rounded-lg"></div><div class="h-24 bg-slate-100 rounded-xl"></div><div class="h-24 bg-slate-100 rounded-xl"></div></div>`})
export class LoaderComponent {}
