import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';

@Component({
    selector: 'mall-scoreDetail',
    templateUrl: 'scoreDetail.html',
})

export class ScoreDetailComponent implements OnInit {

    transaction: TableStr = {
        data: gql`query($index:Int,$size:Int,$info:searchTransaction){
            list:getTransactionPage(pageIndex:$index,pageSize:$size,transaction:$info){
                id,Goods{id,name},User{id,username},createAt,code,state,endTime
            }
            count:getTransactionCount(transaction:$info)
        }`,
        delete: gql`mutation($id:String){
            deleteTransaction(id:$id)
        }`,
        url: "admin/score",
        where: { transaction: { "\"goodsId\"": `{\\\"$eq\\\":\\\"${this.route.snapshot.params['id']}\\\"}` } }
    };

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() { }

    onData(info: any, dataList: any) {
        for (var i = 0; i < dataList.length; i++) {
            if (dataList[i].state == 1) {
                dataList[i].state = '已兑换';
                continue;
            } else if ((new Date(dataList[i].endTime).getTime() < new Date().getTime())) {
                dataList[i].state = '已过期';
                continue;
            }
            else {
                dataList[i].state = '未兑换';
                continue;
            }
        }
    }

}
