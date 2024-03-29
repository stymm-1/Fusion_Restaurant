
import React, {Component} from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,Button, Modal ,ModalHeader, ModalBody, Input, Label,Row,Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import  { Loading } from './LoadingComponent';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);



   class CommentForm extends Component{
    constructor(props){
        super(props);
        this.toggleModal= this.toggleModal.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);

        this.state={
            isModalOpen:false
        };
    }

toggleModal(){
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });

      }
handleSubmit(values) {
        this.toggleModal(); 
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);

        
    }


      render(){
        return(<div>
             <Button color="#f4c95d" outline onClick={this.toggleModal}>
                 <span className="fa fa-pencil  "></span>  Submit Comment 
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                      <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                      <ModalBody className="col-10 offset-1">
                       <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating">
                                  Rating
                                </Label>
                            
                                  <Control.select
                                    model=".rating"
                                    name="rating"
                                    className="form-control"
                                  >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                  </Control.select>
                                
                              </Row>
                            <Row className="form-group">
                                <Label htmlFor="name">Your Name</Label>
                                <Control.text model=".name" id="name" name="name" placeholder="Your Name" className="form-control"
                                 
                                 validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                 />
                                 <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment">Comment</Label>
                                    <Input type="textarea" name="comment" rows="6"
                                     innerRef={(input) => this.comment = input}/>
                            </Row>
                            <Button  type="submit" value="submit" color="primary">Submit</Button>
                        </LocalForm>
                      </ModalBody>
                </Modal>
                </div>
            );
      }


    
   }

   function RenderDish({dish}) {
        if (dish != null) {
            return(
                <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card className="cardrend">
                    <CardImg  width='100%' src={"/"+dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>

                    </CardBody>
                </Card>
                </FadeTransform>
            );
        } else {
            return(
                <div></div>
            );
        }
    }

    function RenderComments({comments,addComment,dishId}) {
        
        
        if (comments != null) {
            
            const coms = comments.map((com) => {
                
                return (
                    <ul key={com.id} className='list-unstyled'>
                        <li>
                            {com.comment}
                        </li>
                        <li>
                            -- {com.author}, 
                            {
                                new Intl.DateTimeFormat('en-US', {
                                    month: 'short', day: '2-digit', year: 'numeric' 
                                }).format(new Date(com.date))
                            }
                        </li>
                    </ul>
                );
            });
            
            return (
                <div className='p-3'>
                    <h4>Comments</h4>
                    {coms}
                <CommentForm dishId={dishId} addComment={addComment} />
                </div>
            );


        } else {
            return (
                <div></div>
            );
        }
    }




    const DishDetail = (props)  =>{

         if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) 
        {
        return(
        <div className="container">
        <div className="row">
                <Breadcrumb>
                <BreadcrumbItem > <Link to='/menu'>Menu</Link></BreadcrumbItem>
                <BreadcrumbItem  active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr/>
                </div>

            </div>
            <div className='row'>
                <div className='col-12 col-md-5 m-1'>
                    <RenderDish dish={props.dish}/>
                </div>
                <div className='col-12 col-md-5 m-1'>
                  <RenderComments comments={props.comments} addComment={props.addComment} dishId={props.dish.id}/>                </div>
            </div>
            </div>
        );
    }
    }


export default DishDetail;