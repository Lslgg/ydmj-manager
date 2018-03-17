import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
    selector: 'mall-scoreList',
    templateUrl: 'scoreList.html',
})

export class ScoreListComponent implements OnInit {

    businessList: Array<{ key: string, value: string }> = [];

    goods: TableStr = {
        data: gql`query($index:Int,$size:Int,$info:searchGoods){
            list:getGoodsPage(pageIndex:$index,pageSize:$size,goods:$info){
                id,name,Business{id,name},score,GoodsType{id,name},times,createAt
            }
            count:getGoodsCount(goods:$info)
        }`,
        delete: gql`mutation($id:String){
            deleteGoods(id:$id)
        }`,
        url: "admin/addGoods",
        where: { advert: {} }
    };

    constructor(private router: Router, private route: ActivatedRoute, private apollo: Apollo) {
    }

    ngOnInit() {
        this.businessList = [];
        var sql = gql`query{
            list:getBusiness {id, name}
        }`;
        this.apollo.query<{ list: Array<{ id: String, name: String }> }>({ query: sql }).subscribe(({ data }) => {
            if (data.list) {
                for (var i = 0; i < data.list.length; i++) {
                    this.businessList.push({ key: data.list[i].id + '', value: data.list[i].name + '' });
                }
            }
        })
    }

    onSetInfo(info: any) {
        if (info.type == "详细") {
            this.router.navigate(['/admin/scoreDetail/' + info.id]);
        }
    }
}