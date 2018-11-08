import graphene
import graphene_django_optimizer as gql_optimizer  # noqa
from django.contrib.auth.models import User
from graphene import ObjectType, relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from . import models


################################################################################
#
#  Apollo schema
#
################################################################################

class UserType(DjangoObjectType):
    class Meta:
        model = User


class StoreType(DjangoObjectType):
    class Meta:
        model = models.Store


class ProductType(DjangoObjectType):
    class Meta:
        model = models.Product


class OrderType(DjangoObjectType):
    class Meta:
        model = models.Order


class OrderItemType(DjangoObjectType):
    class Meta:
        model = models.OrderItem


class ApolloQuery(graphene.ObjectType):
    all_stores = graphene.List(StoreType)
    all_products = graphene.List(ProductType)
    all_orders = graphene.List(OrderType)
    all_order_items = graphene.List(OrderItemType)

    def resolve_all_stores(self, info):
        return gql_optimizer.query(models.Store.objects.all(), info)

    def resolve_all_products(self, info):
        return gql_optimizer.query(models.Product.objects.all(), info)

    def resolve_all_orders(self, info):
        return gql_optimizer.query(models.Order.objects.all(), info)

    def resolve_all_order_items(self, info):
        return gql_optimizer.query(models.OrderItem.objects.all(), info)


apollo_schema = graphene.Schema(query=ApolloQuery)


################################################################################
#
#  Relay schema
#
################################################################################

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = (
                'password',
                )
        filter_fields = {
                'first_name': ['contains'],
                }
        interfaces = (relay.Node,)


class StoreNode(DjangoObjectType):
    class Meta:
        model = models.Store
        filter_fields = {
                'name': ['contains'],
                }
        interfaces = (relay.Node,)


class ProductNode(DjangoObjectType):
    class Meta:
        model = models.Product
        filter_fields = {
                'store': ['exact'],
                'name': ['exact', 'icontains'],
                }
        interfaces = (relay.Node,)


class OrderNode(DjangoObjectType):
    class Meta:
        model = models.Order
        filter_fields = {}
        interfaces = (relay.Node,)


class OrderItemNode(DjangoObjectType):
    class Meta:
        model = models.OrderItem
        filter_fields = {}
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    user = relay.Node.Field(UserNode)
    all_users = DjangoFilterConnectionField(UserNode)

    store = relay.Node.Field(StoreNode)
    all_stores = DjangoFilterConnectionField(StoreNode)

    product = relay.Node.Field(ProductNode)
    all_products = DjangoFilterConnectionField(ProductNode)

    order = relay.Node.Field(OrderNode)
    all_orders = DjangoFilterConnectionField(OrderNode)

    order_item = relay.Node.Field(OrderItemNode)
    all_order_items = DjangoFilterConnectionField(OrderItemNode)


class CreateStoreMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String(required=True)
        owner_id = graphene.ID(required=True)

    store = graphene.Field(StoreNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **data):
        owner = graphene.Node.get_node_from_global_id(info, data['owner_id'])
        store = models.Store.objects.create(name=data['name'], owner=owner)
        return CreateStoreMutation(store=store)


class CreateProductMutation(relay.ClientIDMutation):
    class Input:
        store_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        price = graphene.Float(required=True)

    product = graphene.Field(ProductNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **data):
        store = graphene.Node.get_node_from_global_id(info, data['store_id'])
        product = models.Product.objects.create(
                store=store,
                name=data['name'],
                price=data['price'],
                )
        return CreateProductMutation(product=product)


class UpdateProductMutation(relay.ClientIDMutation):
    class Input:
        id = graphene.ID(required=True)
        store_id = graphene.ID(required=False)
        name = graphene.String(required=False)
        price = graphene.Float(required=False)

    product = graphene.Field(ProductNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **data):
        product = graphene.Node.get_node_from_global_id(info, data.pop('id'))
        store_id = data.pop('store_id', None)
        if store_id:
            product.store = graphene.Node.get_node_from_global_id(info, store_id)
        vars(product).update(data)
        product.save()
        return UpdateProductMutation(product=product)


class Mutation(ObjectType):
    add_store = CreateStoreMutation.Field()
    add_product_to_store = CreateProductMutation.Field()
    update_store_product = UpdateProductMutation.Field()


relay_schema = graphene.Schema(query=Query, mutation=Mutation)
