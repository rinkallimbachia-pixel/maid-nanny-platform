import { Component, Input } from '@angular/core';

@Component({selector:'app-empty-state',standalone:true,template:`<div class="text-center p-8 surface-card"><span class="material-symbols-outlined text-4xl text-slate-300">inbox</span><h3 class="font-semibold mt-2">{{title}}</h3><p class="text-sm text-slate-500">{{description}}</p></div>`})
export class EmptyStateComponent { @Input() title='No data available'; @Input() description='Try changing filters or come back later.'; }
